
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Extract params from the URL
  const { pathname } = request.nextUrl; 

 
  // pathname: /api/company/12345678/files/abcd1234.pdf
  const pathParts = pathname.split('/').filter(Boolean);

  // Validate path
  if (pathParts.length > 5) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  const company_number = pathParts[2]; // index 3: company_number
  const doc_with_ext = pathParts[4]; // index 5: doc_with_ext

  if (!doc_with_ext.endsWith('.pdf')) {
    return NextResponse.json({ error: 'Invalid document format' }, { status: 400 });
  }

  // Strip .pdf from the document ID
  const doc_id = doc_with_ext.replace(/\.pdf$/, '');


const externalUrl = `https://find-and-update.company-information.service.gov.uk/company/${company_number}/filing-history/${doc_id}/document?format=pdf&amp;download=0`;

 
  try {
    const response = await fetch(externalUrl, {
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.CH_API_KEY + ':').toString('base64')}`
      }
    });

    if (!response.ok) {
      return new NextResponse('Failed to fetch document', { status: response.status });
    }

    const readableStream = response.body;

    const res = new NextResponse(readableStream, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="company-compass-${company_number}-${doc_with_ext}"`,
      },
    });

    return res;

  } catch (error) {
    console.error('[Document Proxy Error]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
