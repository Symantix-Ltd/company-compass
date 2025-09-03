import { NextResponse } from 'next/server';

interface GazetteLink {
  "@href": string;
  "@rel"?: string;
  "@title"?: string;
  "@type"?: string;
}

interface GazetteAuthor {
  name: string;
}

interface GazetteCategory {
  "@term": string;
}

interface GazetteGeoPoint {
  "geo:lat": string;
  "geo:long": string;
}

interface GazetteEntry {
  id: string;
  "f:status": string;
  "f:notice-code": string;
  title: string;
  link: GazetteLink[];
  author: GazetteAuthor;
  updated: string;
  published: string;
  category: GazetteCategory;
  "geo:Point": GazetteGeoPoint;
  content: string;
  [key: string]: any; // catch any other properties
}

interface GazetteApiResponse {
  entry: GazetteEntry[];
  "f:total": string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  let date = searchParams.get('date');
  const pageSize = Number(searchParams.get('pageSize') || '100');

  if (!date) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    date = `${yyyy}-${mm}-${dd}`;
  }

  let allEntries: Omit<GazetteEntry, 'link'>[] = [];
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const feedUrl = `https://www.thegazette.co.uk/all-notices/publish-date/${date}/notice/data.json?categorycode-all=all&noticetypes=2443&results-page-size=${pageSize}&results-page=${page}`;
      
     
      
      const response = await fetch(feedUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch page ${page}`);
      }

      const data: GazetteApiResponse = await response.json();

      if (!data?.entry?.length) break;

      // Remove 'link' from each entry safely
      const entriesWithoutLinks = data.entry.map(({ link, ...rest }) => rest);

      allEntries = allEntries.concat(entriesWithoutLinks);

      const totalResults = Number(data['f:total'] || 0);
      totalPages = Math.ceil(totalResults / pageSize);

      page++;
    } while (page <= totalPages);

    return new NextResponse(JSON.stringify(allEntries), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching Gazette data:', error);
    return new NextResponse('Failed to fetch Gazette data', { status: 500 });
  }
}
