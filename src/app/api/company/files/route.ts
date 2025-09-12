// app/api/gazette_rss/route.ts
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyNumber = searchParams.get('companyNumber') || '';

  // Construct the RSS feed URL
  const feedUrl = `https://www.thegazette.co.uk/all-notices/notice/data.feed?text=${companyNumber}&categorycode=G105000000,G411000001&results-page-size=20&results-page=1`;

  try {
    const response = await fetch(feedUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const xml = await response.text();

    return new NextResponse(xml, {
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch (error) {
    console.error('Error fetching RSS:', error);
    return new NextResponse('Failed to fetch RSS feed', { status: 500 });
  }
}
