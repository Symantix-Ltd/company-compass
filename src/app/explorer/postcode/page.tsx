export const dynamic = 'force-dynamic';

// app/search/page.tsx
import SearchFormPostcode from '../../components/SearchFormPostcode'; // adjust path as needed
import { BuildingOfficeIcon } from '@heroicons/react/24/solid';
import AdSlot from '../../components/AdSlot'
//import PostcodeMap from '../../components/PostcodeMap'
interface CompanyResult {
  company_number: string;
  title: string;
  company_status: string;
  date_of_creation: string;
  date_of_cessation?: string;
  address_snippet?: string;
  links: { self: string };
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/\./g, '') 
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Server component version
interface Props {
    params: Promise<{ [key: string]: string | string[] | undefined }>;
    searchParams: Promise<{ q?: string }>;
}


export default async function SearchPage({ params, searchParams }: Props) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
  
    const query = resolvedSearchParams.q || '';
    let results: CompanyResult[] = [];

/*
export default async function SearchPage({ searchParams }: Props) {
    const params = searchParams;

    const query = params.q || '';
  let results: CompanyResult[] = [];
*/

  if (query) {
    try {
      const res = await fetch( process.env.BASE_URL + `/api/search?q=${encodeURIComponent(query)}`,  { cache: 'no-store' });
      if (res.ok) {
        results = await res.json();
      }
    } catch (err) {
     console.log(err)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
    <main className="max-w-6xl mx-auto p-6 bg-white rounded-lg text-gray-900">
     
    <h1 className=" text-3xl font-bold">Company Address - Postcode Search</h1>
    <p>Search for companies listed in Companies House using postcode</p>
<br/>
<SearchFormPostcode/>
      <br />
      <h2 className="text-2xl font-bold mb-4"><span className='font-bold'>{query.toUpperCase()}</span></h2>
<br/>




      {results.length === 0 && query && <p>No results found.</p>}

      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 ">
        {results.map((company) => {
          const slug = `${company.company_number}/${slugify(company.title)}/companies-house-data`;
          const companyUrl = `/company/${slug}`;

          return (
            <div key={company.company_number} className="border p-4 rounded shadow-md flex gap-4">
              <div className="w-16 h-16 flex-shrink-0">
                <BuildingOfficeIcon className="size-8 text-blue-500" />
              </div>
              <div className="flex-1">
                <a href={companyUrl} className="text-blue-600 font-bold text-lg underline">
                  {company.title}
                </a>
                {company.address_snippet && <p className="mb-2">{company.address_snippet}</p>}
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
     <aside className="lg:w-1/4 p-4">
          
       

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
