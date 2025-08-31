// src/app/explorer/insolvency/page.tsx

import { BuildingOfficeIcon } from '@heroicons/react/24/solid';


export const dynamic = 'force-static';
export const revalidate = 3600;


interface Notice {
  id: string;
  companyName: string;
  companyNumber: string;
  noticeType: string;
  insightUrl: string;
  published: string;
  dateString: string;
  summary: string;
}

interface CompanyBlock {
  companyName: string;
  companyNumber: string;
  insightUrl: string;
  notices: Notice[];
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}


  let title = `Company Insolvency UK - Company Compass`;

  let description = `Company Insolvency UK - Recent appointment of administrators, appointment of liquidators, winding up petition notices and winding up order notices published in The Gazette.`;
  

  export const metadata = {
    title: title,
    description: description
        ,
        openGraph: {
            title: title,
            description: description,
            url: `https://www.companycompass.co.uk/explorer/company_insolvency`
          }
  };


export default async function InsolvencyPage() {
  const res = await fetch(`${process.env.BASE_URL}/api/gazette/corporate_insolvency/publish_date_all`, {
    next: { revalidate },
  });

  if (!res.ok) {
    console.error('Failed to fetch insolvency data');
    return <div>Failed to load data.</div>;
  }

  const json = await res.json();
  const entries = Array.isArray(json) ? json : json?.entry || [];

  const notices: Notice[] = entries.flatMap((entry: any) => {
    const id = entry.id;
    const companyName = entry.title.replace(/\n/g, '').replace(/\/n|\/N/g, '').trim();
    const content = entry.content || '';
    const published = entry.published;
    const category = entry.category?.['@term'] || 'Notice';

    const companyNumberMatch = content.match(/Company Number[:]*\s*(\w+)/i);
    const companyNumber = companyNumberMatch ? companyNumberMatch[1] : '';

    if (!companyNumber) return [];

    const date = new Date(published);
    const dateString = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const summary = content.replace(/<[^>]*>/g, '').slice(0, 200) + '...';

    const slug = `${companyNumber}-${slugify(companyName)}`;
    const insightUrl = `/insight/company/${slug}`;

    return {
      id,
      companyName,
      companyNumber,
      noticeType: category,
      insightUrl,
      published,
      dateString,
      summary,
    };
  });


// Group notices by companyNumber or companyName
const grouped: Record<string, CompanyBlock> = {};

for (const notice of notices) {
  const key = notice.companyNumber;
  if (!grouped[key]) {
    grouped[key] = {
      companyName: notice.companyName,
      companyNumber: notice.companyNumber,
      insightUrl: notice.insightUrl,
      notices: [],
    };
  }
  grouped[key].notices.push(notice);
}

  

  // Convert grouped object to array and sort by company name
  const companyBlocks = Object.values(grouped).sort((a, b) =>
    a.companyName.localeCompare(b.companyName)
  );

  return (
    <main className="max-w-6xl mx-auto  bg-white rounded-lg text-gray-900">
      <br/>
      <h1 className="f-heading-8 mb-4">Company Insolvency UK</h1>
      <p>Recent company insolvency events as notified in <a href="https://www.thegazette.co.uk">The Gazette</a></p>
<br/>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {companyBlocks.map((company) => (
          <div key={company.companyNumber || company.companyName} className="border p-4 rounded shadow-sm flex gap-4">
            <div className="w-10 h-10 flex-shrink-0">
              <BuildingOfficeIcon className="size-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <a href={company.insightUrl} className="text-blue-600 font-bold text-base">
                {company.companyName}
              </a>
              {company.companyNumber && (
                <p className="text-sm text-gray-500 mb-2">
                  Company Number: {company.companyNumber}
                </p>
              )}

              <div className="space-y-2">
                {company.notices.map((notice) => (
                  <div key={notice.id} className="border-t pt-2">
                    <span className="block text-sm font-medium">{notice.noticeType}</span>
                    <span className="block text-xs text-gray-500 mb-1">Published: {notice.dateString}</span>
                    <p className="text-sm text-gray-700">{notice.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
