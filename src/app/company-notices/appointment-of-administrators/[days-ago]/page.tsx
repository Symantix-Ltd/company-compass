// src/app/explorer/insolvency/page.tsx

import { BuildingOfficeIcon, ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon } from '@heroicons/react/24/solid';



import AdSlot from '../../../components/AdSlot';
import NoticeDateNavigation from '../../../components/NoticeDateNavigation';

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


  let title = `Gazette Company Notices - Appointment of Administrators - Company Compass`;

  let description = `Company Insolvency UK - Appointment of administrators, appointment of liquidators, winding up petition notices and winding up order notices published in The Gazette.`;
  

  export const metadata = {
    title: title,
    description: description
        ,
        openGraph: {
            title: title,
            description: description,
            url: `https://www.companycompass.co.uk/company-notices/appointment-of-administrators`
          }
  };


export default async function InsolvencyPage() {
  const res = await fetch(`${process.env.BASE_URL}/api/gazette/company-insolvency/appointment-of-administrators`, {
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

    const slug = `${companyNumber}/${slugify(companyName)}/companies-house-data`;
    const insightUrl = `/company/${slug}`;

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
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
    <main className="max-w-4xl mx-auto p-6 bg-white rounded-lg text-gray-900">
      
      <h1 className="f-heading-8 mb-4">Appointment of Administrators</h1>
      <p>Appointment of Administrator notices published in <a className="italic" href="https://www.thegazette.co.uk">The Gazette</a></p>

<NoticeDateNavigation baseUrl="/company-notices/appointment-of-administrators" />


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
                   
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
    <aside className="w-full lg:w-1/3 p-4">
          
          <AdSlot
                    client="ca-pub-7212919066729459" 
                    slot="9729092224"            
                  />
          
          <br/>    
          <AdSlot
                    client="ca-pub-7212919066729459" 
                    slot="4867705256"           
                  />
          
                  </aside>
</div>
</div>
  );
}
