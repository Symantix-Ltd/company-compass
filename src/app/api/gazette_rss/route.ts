// src/app/api/rss/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const feedUrl = 'https://www.thegazette.co.uk/all-notices/notice/data.feed?text=&categorycode=G205010000&results-page-size=100&results-page=1';

  try {
    const response = await fetch(feedUrl);
    const xml = await response.text();

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error fetching RSS:', error);
    return new NextResponse('Failed to fetch RSS feed', { status: 500 });
  }
}
