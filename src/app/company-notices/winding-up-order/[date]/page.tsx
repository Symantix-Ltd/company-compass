import { BuildingOfficeIcon } from '@heroicons/react/24/solid';
import AdSlot from '../../../components/AdSlot';
import NoticeDateNavigation from '../../../components/NoticeDateNavigation';
import BreadcrumbsWrapper from '../../../components/BreadcrumbsWrapper';

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;
  return [{ date: todayStr }];
}


type Params = {
  date: string;
 
};




export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { date } = await params;
  const title = `Gazette Company Notices - Winding-Up Order - ${date} - Company Compass`;
  const description = `Winding-Up Order notices published in The Gazette on ${date} - Company Compass`;

  return {
    title,
    description,
    keywords: "Gazette Insolvency Notices Winding-Up Orders Company Compass ${date}",
    openGraph: {
      title,
      description,
      url: `https://www.companycompass.co.uk/company-notices/winding-up-order/${date}`,
    },
  };
}
  





// ✅ Page component — do NOT define a custom PageProps type
export default async function InsolvencyPage({ params }: { params: Promise<Params> }) {
  const { date}   = await params;

  const currentDate = new Date(date);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const isToday = currentDate.getTime() === today.getTime();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.BASE_URL;

  const res = await fetch(
    `https://www.companycompass.co.uk/api/gazette/company-insolvency/winding-up-order?date=${date}`,
    { next: { revalidate: isToday ? 3600 : false } }
  );

  if (!res.ok) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded">
        Failed to load notices for {date}. Please try again later.
      </div>
    );
  }

  const json = await res.json();
  const entries = Array.isArray(json) ? json : json?.entry || [];

  interface Notice {
    id: string;
    companyName: string;
    companyNumber: string;
    noticeType: string;
    insightUrl: string;
    published: string;
    dateString: string;
    summary: string;
  }

  interface CompanyBlock {
    companyName: string;
    companyNumber: string;
    insightUrl: string;
    notices: Notice[];
  }

  const notices: Notice[] = entries.flatMap((entry: any) => {
    const id = entry.id;
    const companyName = entry.title.replace(/\n/g, '').replace(/\/n|\/N/g, '').trim();
    const content = entry.content || '';
    const published = entry.published;
    const category = entry.category?.['@term'] || 'Notice';

    const companyNumberMatch = content.match(/Company Number[:]*\s*(\w+)/i);
    const companyNumber = companyNumberMatch ? companyNumberMatch[1] : '';

    if (!companyNumber) return [];

    const dateObj = new Date(published);
    const dateString = dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const summary = content.replace(/<[^>]*>/g, '').slice(0, 200) + '...';

    const slug = `${companyNumber}/${slugify(companyName)}/companies-house-data`;
    const insightUrl = `/company/${slug}`;

    return {
      id,
      companyName,
      companyNumber,
      noticeType: category,
      insightUrl,
      published,
      dateString,
      summary,
    };
  });

  const grouped: Record<string, CompanyBlock> = {};
  for (const notice of notices) {
    const key = notice.companyNumber;
    if (!grouped[key]) {
      grouped[key] = {
        companyName: notice.companyName,
        companyNumber: notice.companyNumber,
        insightUrl: notice.insightUrl,
        notices: [],
      };
    }
    grouped[key].notices.push(notice);
  }

  const companyBlocks = Object.values(grouped).sort((a, b) =>
    a.companyName.localeCompare(b.companyName)
  );

  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  const previousDateObj = new Date(currentDate);
  previousDateObj.setDate(currentDate.getDate() - 1);
  const nextDateObj = new Date(currentDate);
  nextDateObj.setDate(currentDate.getDate() + 1);
  const previousDate = formatDate(previousDateObj);
  const nextDate = nextDateObj <= today ? formatDate(nextDateObj) : null;

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
        <main className="max-w-4xl mx-auto p-6 bg-white rounded-lg text-gray-900">
          <BreadcrumbsWrapper/>
          <h1 className="font-bold text-3xl">Winding-Up Orders</h1>
          <p>
            Winding-Up Order notices published in{' '}
            <a className="italic" href="https://www.thegazette.co.uk">
              The Gazette
            </a>
          </p>

          <NoticeDateNavigation
            baseUrl="/company-notices/winding-up-order"
            currentDate={date}
            previousDate={previousDate}
            nextDate={nextDate}
          />

          {companyBlocks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {companyBlocks.map((company) => (
                <div
                  key={company.companyNumber || company.companyName}
                  className="border p-4 rounded shadow-sm flex gap-4"
                >
                  <div className="w-10 h-10 flex-shrink-0">
                    <BuildingOfficeIcon className="size-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <a href={company.insightUrl} className="text-blue-600 font-bold text-base">
                      {company.companyName}
                    </a>
                    {company.companyNumber && (
                      <p className="text-sm text-gray-500 mb-2">
                        Company Number: {company.companyNumber}
                      </p>
                    )}
                    <div className="space-y-2">
                      {company.notices.map((notice) => (
                        <div key={notice.id} className="border-t pt-2">
                          <span className="block text-sm font-medium">{notice.noticeType}</span>
                          <span className="block text-xs text-gray-500 mb-1">
                            Published: {notice.dateString}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 p-6 text-center text-gray-600 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-lg font-medium">No notices were published on this date.</p>
              <p className="text-sm mt-1">Try browsing to a different date using the arrows above.</p>
            </div>
          )}
        </main>

        <aside className="w-full lg:w-1/3 p-4">
          <AdSlot client="ca-pub-7212919066729459" slot="9729092224" />
          <br />
          <AdSlot client="ca-pub-7212919066729459" slot="4867705256" />
        </aside>
      </div>
    </div>
  );
}
