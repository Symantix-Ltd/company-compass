import SearchForm from './components/SearchForm';
import RssFeed from './components/RssFeed';
import Insights from './components/Insights';
import AdSlot from './components/AdSlot'
import { BuildingOfficeIcon } from '@heroicons/react/24/solid';



export const dynamic = 'force-dynamic';
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



export default async function Home() {

  const res = await fetch(`${process.env.BASE_URL}/api/gazette/corporate_insolvency/appointment-of-administrators`, {
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
      <aside className="md:w-1/4 lg:w-1/4 p-4 bg-blue-100 rounded ">
      
        
        <p className="text-blue-600 font-bold f-heading-10">Appointment of Administrators</p>
        <p>Recent <a className="underline italic" href="company-notices/appointment-of-administrators/0">Appointment of Administrators</a> notices published in The Gazette</p>
   <br/>
    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
      {companyBlocks.map((company) => (
        <div key={company.companyNumber || company.companyName} className="border p-4 rounded shadow-sm flex gap-4">
          <div className="w-4 h-8 flex-shrink-0">
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
                 
                  <span className="block text-xs text-gray-500 mb-1">Published: {notice.dateString}</span>
                
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
   
      </aside>
        {/* Main Content */}
        <main className="flex-1">
          <div className="xl:grid-layout gap-y-0 mt-16 md:mt-24">
            <div className="xl:col-span-9">
              <div className="f-heading-8">
                Company checks made simple
              </div>

              <p className="text-lg text-gray-700 leading-relaxed max-w-prose mt-4">
                Our platform provides comprehensive data on UK companies, sourced directly from{" "}
                <strong className="text-gray-900">Companies House</strong> and{" "}
                <strong className="text-gray-900">The Gazette</strong>. Access official company filings, insolvency notices, and public records all in one place, making business research and compliance easier than ever.
              </p>

              <div className="mt-6">
                
                <SearchForm />
                
              </div>

           
            </div>
            
          </div>
          

      
      
        {/* Services Section */}
        <section className="mb-16 mt-16">
            <h2 id="about" className="f-heading-1">What We Offer</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700 text-lg max-w-prose mt-6">
              {[
                "Up-to-date company registration and filing data from Companies House",
                "Official insolvency and liquidation notices from The Gazette",
                "Searchable company profiles with key business insights",
                "Alerts and monitoring for changes in company status",
                "Upcoming ChatGPT-style smart search to query company info in natural language"
              ].map((text, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <span className="inline-block mt-1 text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Contact Section */}
          <section id="contact" className="mb-16 max-w-prose">
            <h2 className="f-heading-1">Contact & Support</h2>
            <p className="text-lg text-gray-700 leading-relaxed mt-4">
              Questions or feedback? Reach out to us at{" "}
              <a href="mailto:contact@symantix.co.uk" className="text-blue-600 underline hover:text-blue-800">
                contact@symantix.co.uk
              </a>.
            </p>
          </section>
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
