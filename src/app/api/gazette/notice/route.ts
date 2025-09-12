// app/api/gazette/notice/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const noticeId = req.nextUrl.searchParams.get('q');
  if (!noticeId) {
    return NextResponse.json({ error: 'Missing notice ID parameter "q"' }, { status: 400 });
  }

  const NOTICE_URL = `https://www.thegazette.co.uk/notice/${noticeId}/data.jsonld`;

  try {
    const response = await fetch(NOTICE_URL);
    if (!response.ok) {
      return NextResponse.json({ error: 'Notice not found' }, { status: 404 });
    }

    const data = await response.json();
    const graph = data['@graph'] || [];

    // --- Extract main entities ---
    const company = graph.find((item: any) => item['@type']?.includes('gazorg:LimitedCompany'));
    const ip = graph.find((item: any) => item['@type']?.includes('foaf:Agent'));
    const edition = graph.find((item: any) => item['@type']?.includes('gaz:Edition'));
    const notice = graph.find((item: any) => item['@type']?.includes('gaz:Notice'));

    const registeredOffice = graph.find((item: any) => item['@id'] === company?.hasRegisteredOffice);
    const principalTrading = graph.find((item: any) => item['@id'] === company?.hasPrincipalTradingAddress);
    const firm = graph.find((item: any) => item['@id'] === ip?.hasOrganisationMember);

    // --- Extract court case ---
    const courtCaseItem = graph.find((item: any) => item['@type']?.includes('court:CourtCase'));
    const courtItem = courtCaseItem ? graph.find((item: any) => item['@id'] === courtCaseItem.hasCourt) : null;

    const court = courtItem
      ? {
          name: courtItem.courtName || '',
          caseCode: courtCaseItem.caseCode || ''
        }
      : undefined;

    const noticeData = {
      noticeId: notice?.hasNoticeID || noticeId,
      status: 'Published',
      noticeCode: notice?.['gaz:hasNoticeCode'] || '',
      publicationDate: notice?.hasPublicationDate || '',
      company: company
        ? {
            name: company.name,
            number: company.companyNumber,
            registeredOffice: registeredOffice?.['vcard:label'] || '',
            principalTradingAddress: principalTrading?.['vcard:label'] || '',
            natureOfBusiness: company.natureOfBusiness || ''
          }
        : undefined,
      insolvencyPractitioner: ip
        ? {
            name: ip['foaf:name'] || `${ip.firstName} ${ip.familyName}`,
            firm: firm?.name || '',
            firmAddress: graph.find((item: any) => item['@id'] === ip?.adr)?.['vcard:label'] || '',
            idCode: ip.hasIPnum || ''
          }
        : undefined,
      court,
      edition: edition?.editionName || ''
    };

    return NextResponse.json(noticeData);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch notice' }, { status: 500 });
  }
}
