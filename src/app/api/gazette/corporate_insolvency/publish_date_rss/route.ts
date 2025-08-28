import { NextResponse } from 'next/server';

// Helper to slugify company name for URL
function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanum with hyphen
    .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens
}

// Extract company number from content text
function extractCompanyNumber(content: string): string | null {
  const match = content.match(/Company Number:?\s*(\d+)/i);
  return match ? match[1] : null;
}

// Type definitions for Gazette API
interface GazetteLink {
  "@href": string;
  "@rel"?: string;
  "@title"?: string;
  "@type"?: string;
}

interface GazetteEntry {
  id: string;
  "f:status": string;
  "f:notice-code": string;
  title: string;
  link: GazetteLink[];
  updated: string;
  content: string;
  [key: string]: any; // catch-all for unknown fields
}

interface GazetteApiResponse {
  entry: GazetteEntry[];
  "f:total": string;
}

// Type for cleaned entry used in RSS feed
interface CleanedEntry {
  title: string;
  publishedDate: string;
  companyNumber: string | null;
  [key: string]: any;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Get date and pageSize from query params
  let date = searchParams.get('date');
  const pageSize = Number(searchParams.get('pageSize') || '100');

  // Default date to today if not provided
  if (!date) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    date = `${yyyy}-${mm}-${dd}`;
  }

  let allEntries: CleanedEntry[] = [];
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const feedUrl = `https://www.thegazette.co.uk/all-notices/publish-date/${date}/notice/data.json?categorycode=G205010000&results-page-size=${pageSize}&results-page=${page}`;
      const response = await fetch(feedUrl);

      if (!response.ok) throw new Error(`Failed to fetch page ${page}`);

      const data: GazetteApiResponse = await response.json();

      if (!data?.entry?.length) break;

      // Map entries: remove 'link', extract company number, keep title & publishedDate
      const cleanedEntries: CleanedEntry[] = data.entry.map(
        ({ link, updated, title, content, ...rest }: GazetteEntry) => ({
          ...rest,
          title,
          publishedDate: updated,
          companyNumber: extractCompanyNumber(content || ''),
        })
      );

      allEntries = allEntries.concat(cleanedEntries);

      const totalResults = Number(data['f:total'] || 0);
      totalPages = Math.ceil(totalResults / pageSize);

      page++;
    } while (page <= totalPages);

    // Filter out entries without a company number
    const validEntries = allEntries.filter((entry) => entry.companyNumber);

    // Generate RSS feed branded for Company Compass
    const rssItems = validEntries
      .map((entry) => {
        const companyNumber = entry.companyNumber!;
        const companyName = entry.title.replace(/\n/g, '').replace(/\/n/g, '').trim(); 
        const url = `https://www.companycompass.co.uk/insight/company/${companyNumber}-${slugify(companyName)}`;

        return `
          <item>
            <title><![CDATA[${companyName}]]></title>
            <link>${url}</link>
            <guid isPermaLink="true">${url}</guid>
            <pubDate>${new Date(entry.publishedDate).toUTCString()}</pubDate>
            <description><![CDATA[View company details on Company Compass]]></description>
          </item>
        `;
      })
      .join('');

    const rssFeed = `
      <?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>Company Compass - Corporate Insolvency Notices</title>
          <link>https://www.companycompass.co.uk</link>
          <description>Corporate insolvency notices for ${date} - from Company Compass</description>
          <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
          ${rssItems}
        </channel>
      </rss>
    `;

    return new NextResponse(rssFeed.trim(), {
      headers: { 'Content-Type': 'application/rss+xml' },
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return new NextResponse('Failed to fetch Company Compass feed', { status: 500 });
  }
}
