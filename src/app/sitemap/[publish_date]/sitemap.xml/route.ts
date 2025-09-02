import { NextRequest, NextResponse } from 'next/server';

// Tell Next.js: statically generate on first request
export const dynamic = 'force-static';
// Regenerate once per day (or whatever you prefer)
export const revalidate = 86400;

// Helper to slugify company name for URL
function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractCompanyNumber(content: string): string | null {
  const match = content.match(/Company Number:?\s*(\d+)/i);
  return match ? match[1] : null;
}

function normalizeTitle(title: any): string {
  if (typeof title === 'string') return title.trim();
  if (typeof title === 'object') {
    return (title['#text'] || title['@term'] || 'Unknown Company').trim();
  }
  return 'Unknown Company';
}

interface GazetteEntry {
  id: string;
  "f:status": string;
  "f:notice-code": string;
  title: string;
  link: any[];
  updated: string;
  content: string;
  [key: string]: any;
}

interface GazetteApiResponse {
  entry: GazetteEntry[];
  "f:total": string;
}

interface CleanedEntry {
  title: string;
  publishedDate: string;
  companyNumber: string | null;
  [key: string]: any;
}

export async function GET(_req: NextRequest, context: any) {
  const dateParam = context.params.publish_date;
  let date = dateParam;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    date = `${yyyy}-${mm}-${dd}`;
  }

  const pageSize = 100;
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

      const cleanedEntries: CleanedEntry[] = data.entry.map(
        ({ title, updated, content, ...rest }) => ({
          ...rest,
          title: normalizeTitle(title),
          publishedDate: updated,
          companyNumber: extractCompanyNumber(content || ''),
        })
      );

      allEntries = allEntries.concat(cleanedEntries);

      const totalResults = Number(data['f:total'] || 0);
      totalPages = Math.ceil(totalResults / pageSize);
      page++;
    } while (page <= totalPages);

    const validEntries = allEntries.filter((entry) => entry.companyNumber);

    const sitemapItems = validEntries
      .map((entry) => {
        const companyNumber = entry.companyNumber!;
        const companyName = entry.title;
        const url = `https://www.companycompass.co.uk/company/${companyNumber}/${slugify(companyName)}/companies-house-data`;
        const lastMod = new Date().toISOString();

        return `
          <url>
            <loc>${url}</loc>
            <lastmod>${lastMod}</lastmod>
            <changefreq>daily</changefreq>  
            <priority>0.8</priority>
          </url>
        `;
      })
      .join('');

    const sitemap = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${sitemapItems}
      </urlset>
    `;

    return new NextResponse(sitemap.trim(), {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=0, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
