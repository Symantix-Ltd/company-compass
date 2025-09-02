import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { InferGetStaticPropsType } from 'next';

interface Notice {
  id: string;
  companyNumber: string;
  companyName: string;
  noticeType: string;
  insightUrl: string;
  published: string;
  dateString: string;
}

interface GroupedNotices {
  [date: string]: Notice[];
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function RssFeed({
  groupedByDate,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <p className="f-heading-8">Corporate Insolvency</p>
      <p>
        Recent appointment of administrators, appointment of liquidators, winding up petition notices and winding up order notices.
      </p>

      {Object.entries(groupedByDate).map(([date, noticesOnDate]) => (
        <div key={date} style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{date}</p>

          {noticesOnDate.map((notice) => (
            <div key={notice.id} style={{ marginBottom: '0.5rem' }}>
              <a
                href={notice.insightUrl}
                style={{
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  display: 'block',
                  textDecoration: 'underline',
                  marginBottom: '2px',
                }}
              >
                {notice.companyName} - {notice.noticeType}
              </a>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export async function getStaticProps() {
  try {
    const feedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/gazette_rss`;
    const res = await axios.get(feedUrl);

    const parsed = await parseStringPromise(res.data, {
      explicitArray: false,
      mergeAttrs: true,
    });

    const entries = parsed?.feed?.entry;
    const items = Array.isArray(entries) ? entries : entries ? [entries] : [];

    const noticesParsed: Notice[] = items.map((entry: any) => {
      const contentText = entry.content?.div?.p || entry.content?._ || '';

      const companyNumberMatch = contentText.match(/Company Number[:]*\s*(\w+)/i);
      const companyNumber = companyNumberMatch ? companyNumberMatch[1] : '';

      const companyName = entry.title || '';
      const noticeType = entry.category?.term || 'Notice';

      const insightUrl = companyNumber
        ? `/${companyNumber}/${slugify(companyName)}/companies-house-data`
        : '#';

      const publishedDate = new Date(entry.published);
      const dateString = publishedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      return {
        id: entry.id,
        companyNumber,
        companyName,
        noticeType,
        insightUrl,
        published: entry.published,
        dateString,
      };
    });

    // Group by date
    const groupedByDate: GroupedNotices = {};
    noticesParsed.forEach((notice) => {
      if (!groupedByDate[notice.dateString]) groupedByDate[notice.dateString] = [];
      groupedByDate[notice.dateString].push(notice);
    });

    return {
      props: {
        groupedByDate,
      },
      // Rebuild the page every hour
      revalidate: 3600,
    };
  } catch (err) {
    console.error('Failed to fetch RSS feed', err);
    return {
      props: {
        groupedByDate: {},
      },
      revalidate: 3600,
    };
  }
}
