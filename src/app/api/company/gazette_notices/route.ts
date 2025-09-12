// app/api/gazette_rss/route.ts
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyNumber = searchParams.get('companyNumber') || '';

    // Gazette JSON feed
    const feedUrl = `https://www.thegazette.co.uk/all-notices/notice/data.json?text=${companyNumber}&categorycode=&results-page-size=200&results-page=1`;

    const response = await fetch(feedUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    // Filter entries that have a notice code and sort by publication date descending
    const simplifiedEntries = (data.entry || [])
      .filter((entry: Record<string, any>) => entry['f:notice-code'])
      .sort((a: Record<string, any>, b: Record<string, any>) => {
        const dateA = new Date(a['f:publication-date']).getTime();
        const dateB = new Date(b['f:publication-date']).getTime();
        return dateB - dateA; // newest first
      })
      .map((entry: Record<string, any>) => ({
        id: String(entry.id).split("/").pop(),
        status: entry['f:status'],
        noticeCode: entry['f:notice-code'],
        publicationDate: entry['f:publication-date'],
      }));

    return NextResponse.json(simplifiedEntries);
  } catch (error) {
    console.error('Error fetching Gazette feed:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch feed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
