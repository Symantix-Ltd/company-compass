export const dynamic = 'force-dynamic';

// app/search/page.tsx
import SearchForm from '../components/SearchForm'; // adjust path as needed
import { BuildingOfficeIcon } from '@heroicons/react/24/solid';

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

   
    <main className="max-w-6xl mx-auto p-6 bg-white rounded-lg text-gray-900">
       <br/>
    <h1 className="f-heading-8 mb-4">Company Search</h1>
    <p>Search for a company registered with Companies House</p>
<br/>
      <SearchForm />
      <br />
      <h1 className="text-2xl font-bold mb-4"><span className='font-bold'>{query}</span></h1>
<br/>
      {results.length === 0 && query && <p>No results found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
        {results.map((company) => {
          const slug = `${company.company_number}-${slugify(company.title)}`;
          const companyUrl = `/insight/company/${slug}`;

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
  );
}
