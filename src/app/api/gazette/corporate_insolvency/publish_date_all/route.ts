import { NextResponse } from 'next/server';

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

  let allEntries: any[] = [];
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const feedUrl = `https://www.thegazette.co.uk/all-notices/publish-date/${date}/notice/data.json?categorycode=G205010000&amp;results-page-size=${pageSize}&results-page=${page}`;
      const response = await fetch(feedUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch page ${page}`);
      }

      const data = await response.json();

      if (!data || !data.entry) break;

      // Remove 'link' property from each entry
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
