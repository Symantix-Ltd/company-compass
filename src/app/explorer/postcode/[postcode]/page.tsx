import { BuildingOfficeIcon } from '@heroicons/react/24/solid';

import AdSlot from '../../../components/AdSlot'


// ISR: revalidate once per day
export const revalidate = 86400;

interface CompanyResult {
  company_name: string;
  company_number: string;
  company_status: string;
  date_of_creation: string;
  date_of_cessation?: string;
  links: {
    company_profile: string;
  };
  registered_office_address?: {
    address_line_1?: string;
    address_line_2?: string;
    locality?: string;
    region?: string;
    postal_code?: string;
    country?: string;
  };
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface Params {
  postcode: string;
};

export default async function PostcodePage({ params }: { params: Promise<Params> }) {

  const p = await params;
  const postcode = p.postcode.replace(/-/g, ' ');
  

  let results: CompanyResult[] = [];

  try {
    const res = await fetch(
      `${process.env.BASE_URL}/api/search_postcode?postcode=${encodeURIComponent(postcode)}`
    );
    if (res.ok) {
      results = await res.json();
    } else {
      console.error('Failed to fetch:', res.statusText);
    }
  } catch (err) {
    console.error('Search error:', err);
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
    <main className="max-w-6xl mx-auto p-6 bg-white rounded-lg text-gray-900">
     <br/>
     
      <h1 className="f-heading-7">
        Active companies in <span className="font-bold">{postcode.toUpperCase()}</span>
      </h1>
      <br/>

      {results.length === 0 && postcode && <p>No results found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
        {results.map((company) => {
          const slug = `${company.company_number}/${slugify(company.company_name)}`;
          const companyUrl = `/company/${slug}/companies-house-data`;

          const address = company.registered_office_address;
          const address_snippet = [
            address?.address_line_1,
            address?.address_line_2,
            address?.locality,
            address?.region,
            address?.postal_code,
            address?.country,
          ]
            .filter(Boolean)
            .join(', ');

          return (
            <div key={company.company_number} className="border p-4 rounded shadow-md flex gap-4">
              <div className="w-16 h-16 flex-shrink-0">
                <BuildingOfficeIcon className="size-8 text-blue-500" />
              </div>
              <div className="flex-1">
                <a href={companyUrl} className="text-blue-600 font-bold text-lg underline">
                  {company.company_name}
                </a>
                {address_snippet && <p className="mb-2">{address_snippet}</p>}
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
