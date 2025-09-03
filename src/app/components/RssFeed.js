// app/components/RssFeed.js
import { parseStringPromise } from 'xml2js';

// Helper to convert to title case with lowercase 's
const toTitleCaseWithLowercaseS = (str) =>
  str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()).replace(/`S\b/g, "'s");

export default async function RssFeed() {
  try {
    // Fetch RSS feed at build time / ISR
    const feedUrl = `${process.env.BASE_URL}/api/gazette/corporate-insolvency/publish_date_rss`;
    const res = await fetch(feedUrl, { next: { revalidate: 3600 } }); // rebuild hourly
    const text = await res.text();

    const parsed = await parseStringPromise(text, {
      explicitArray: false,
      mergeAttrs: true,
    });

    const entriesRaw = parsed?.rss?.channel?.item;
    const items = Array.isArray(entriesRaw) ? entriesRaw : entriesRaw ? [entriesRaw] : [];

    const grouped = {};

    // Group by published date
    items.forEach((item) => {
      let insightUrl = '';
      if (Array.isArray(item.link)) {
        const linkObj = item.link.find((l) => l['@href'] || l.href);
        insightUrl = linkObj ? linkObj['@href'] || linkObj.href : '';
      } else if (typeof item.link === 'object') {
        insightUrl = item.link['@href'] || item.link.href || '';
      } else if (typeof item.link === 'string') {
        insightUrl = item.link;
      }
      if (!insightUrl) return;

      const rawCompanyName = item.title || '';
      const companyName = toTitleCaseWithLowercaseS(rawCompanyName.trim());

      const publishedDate = new Date(item.pubDate || new Date().toISOString());
      const dateString = publishedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      const key = companyName;
      if (!grouped[dateString]) grouped[dateString] = new Map();
      if (!grouped[dateString].has(key)) {
        grouped[dateString].set(key, { companyName, insightUrl });
      }
    });

    const finalGrouped = {};
    for (const [date, companyMap] of Object.entries(grouped)) {
      finalGrouped[date] = Array.from(companyMap.values()).sort((a, b) =>
        a.companyName.localeCompare(b.companyName)
      );
    }

    return (
      <div>
        <h2 className="f-heading-1">Company Insolvency</h2>
        <p>
          Recent appointment of administrators, appointment of liquidators, winding up petition notices and winding up order notices.
        </p>
        {Object.entries(finalGrouped).map(([date, companies]) => (
          <div key={date} style={{ marginBottom: '1.5rem' }}>
            <br />
            <ul>
              {companies.map((company, index) => (
                <li key={index}>
                  <a href={company.insightUrl} style={{ textDecoration: 'underline' }}>
                    {company.companyName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  } catch (err) {
    console.error('Failed to fetch RSS feed', err);
    return <p></p>;
  }
}
