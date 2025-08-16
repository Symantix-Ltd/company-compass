// app/api/gazette_rss/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const companyNumber = searchParams.get('companyNumber') || '';

  // Fetch the feed for the company number if provided, otherwise fetch general feed
  const feedUrl = `https://www.thegazette.co.uk/all-notices/notice/data.feed?text=${companyNumber}&categorycode=G105000000&categorycode=G411000001&noticetypes=&location-postcode-1=&location-distance-1=1&location-local-authority-1=&numberOfLocationSearches=1&start-publish-date=&end-publish-date=&edition=&london-issue=&edinburgh-issue=&belfast-issue=&sort-by=&results-page-size=20&results-page=1`;

  try {
    const response = await fetch(feedUrl);
    const xml = await response.text();

    return new NextResponse(xml, {
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch (error) {
    console.error('Error fetching RSS:', error);
    return new NextResponse('Failed to fetch RSS feed', { status: 500 });
  }
}
