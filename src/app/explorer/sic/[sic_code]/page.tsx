export const dynamic = 'force-dynamic';

import sicData from "@/data/sic.json";

// app/search/page.tsx
import { BuildingOfficeIcon } from '@heroicons/react/24/solid';
import AdSlot from '../../../components/AdSlot';
import NoticeBlock from '../../../components/NoticeBlock';
//import PostcodeMap from '../../components/PostcodeMap'
interface CompanyResult {
  company_number: string;
  
  company_status: string;
  date_of_creation: string;
  date_of_cessation?: string | null;
  
  
}

function slugify(title: string) {
  return title?
    .toLowerCase()
    .replace(/\./g, '') 
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface Params {
    sic_code: string;
    
  };


export default async function SearchPage({ params }: { params: Promise<Params> }) {

    const { sic_code } = await params;

    const sicLabel = sicData[sic_code]; 


  let results: CompanyResult[] = [];


  if (sic_code) {
    try {
      const res = await fetch( process.env.BASE_URL + `/api/search/sic_code?q=${encodeURIComponent(sic_code)}`,  { cache: 'no-store' });
      if (res.ok) {
        results = await res.json();
      }
    } catch (err) {
     console.log(err)
    }
  }

  return (
   
<div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto  flex flex-col lg:flex-row gap-8">
        <aside className="  order-3 lg:order-1 md:w-full sm:w-full lg:w-1/4 sm:w-1 p-5 ">

        <h2 className="text-2xl">Company Insolvency</h2>
          <h3 className="text-pink-800 text-bold py-2">Notices published in <a className="italic" href="https://www.thegazette.co.uk/all-notices">The Gazette</a> on {new Date().toLocaleDateString('en-UK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</h3>

          <NoticeBlock
            endpoint="appointment-of-administrators"
            title="Appointment of Administrators"
            linkUrl="company-notices/appointment-of-administrators"
          />
          <br />
          <NoticeBlock
            endpoint="winding-up-petition"
            title="Petitions to Wind Up (Companies)"
            linkUrl="company-notices/winding-up-petition"
          />
          <br />
          <NoticeBlock
            endpoint="appointment-of-liquidator"
            title="Appointment of Liquidator"
            linkUrl="company-notices/appointment-of-liquidator"
          />

          <br />
          <NoticeBlock
            endpoint="winding-up-order"
            title="Winding-Up Order"
            linkUrl="company-notices/winding-up-order"
          />
</aside>
    <main className="order-1 lg:order-2 flex-1 p-5">
     
    <h1 className=" text-3xl font-bold">Company Explorer - SIC Code</h1>
    <p>Companies listed in Companies House</p>

      <h2 className="text-2xl text-pink-700 mb-4"><span className='font-bold'>{sic_code} - {sicLabel}</span></h2>
<br/>




      {results.length === 0 && sic_code && <p>No results found.</p>}

      <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 ">
        {results.map((company) => {
          const slug = `${company.company_number}/${slugify(company.company_name)}/companies-house-data`;
          const companyUrl = `/company/${slug}`;

          return (
            <div key={company.company_number} className="border p-4 rounded shadow-md flex gap-4">
              <div className="w-16 h-16 flex-shrink-0">
                <BuildingOfficeIcon className="size-8 text-blue-500" />
              </div>
              <div className="flex-1">
                <a href={companyUrl} className="text-blue-600 font-bold text-lg underline">
                  {company.company_name}
                </a>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <div>
                    <div>Status</div>
                    <div
                      className={`px-2 py-1 rounded ${
                        company.company_status === 'active'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {company.company_status.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div>Company No.</div>
                    <div>{company.company_number}</div>
                  </div>
                  <div>
                    <div>Incorporated</div>
                    <div>{company.date_of_creation}</div>
                  </div>
                  {company.date_of_cessation && (
                    <div>
                      <div>Dissolved</div>
                      <div>{company.date_of_cessation}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
    <aside className="order-2 w-full lg:order-3 lg:w-1/4 p-4">
          
       

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
