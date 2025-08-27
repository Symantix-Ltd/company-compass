import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Get date, page, and pageSize from query params
  let date = searchParams.get('date');
  const page = searchParams.get('page') || '1';
  const pageSize = searchParams.get('pageSize') || '100';

  // Default date to today if not provided
  if (!date) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(today.getDate()).padStart(2, '0');
    date = `${yyyy}-${mm}-${dd}`;
  }

  const feedUrl = `https://www.thegazette.co.uk/all-notices/publish-date/${date}/notice/data.json?text=&categorycode=G205010000&results-page-size=${pageSize}&results-page=${page}`;

  try {
    const response = await fetch(feedUrl);
    const json = await response.text();

    return new NextResponse(json, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching RSS:', error);
    return new NextResponse('Failed to fetch RSS feed', { status: 500 });
  }
}
