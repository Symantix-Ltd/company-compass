// app/company/[company_number]/[company_name]/gazette-notices/page.tsx
import { revalidate } from 'next/cache';
import { getRecordFromDynamoDB } from '@/lib/dynamo';
import CompanyEvents from '../../../../components/CompanyEvents';
import SearchForm from '../../../../components/SearchForm';
import AdSlot from '../../../../components/AdSlot';
import CompanyMenu from '../../../../components/CompanyMenu';
import CompanyHeader from '../../../../components/CompanyHeader';
import GazetteNotice from '../../../../components/GazetteNotice';

interface Params {
  company_number: string;
  company_name: string;
}

// No pre-rendered pages
export async function generateStaticParams(): Promise<Params[]> {
  return [];
}

async function getCompanyData(company_number: string) {
  const data = await getRecordFromDynamoDB(company_number);
  return data;
}

// Fetch Gazette notices from API
async function getGazetteNotices(company_number: string) {
  const res = await fetch(`${process.env.BASE_URL}/api/company/gazette_notices?companyNumber=${company_number}`, {
    cache: 'no-store', // always fetch fresh data
  });
  if (!res.ok) return [];
  const notices = await res.json();
  return notices; // expects [{id, status, noticeCode}, ...]
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { company_number, company_name } = await params;
  const data = await getCompanyData(company_number);

  if (!data) return { title: 'Company Not Found', description: '' };

  const CompanyName = data.company_name;
  const RegAddress_PostTown = data.registered_office_address.locality;
  const RegAddress_PostCode = data.registered_office_address.postal_code;

  const title = `${CompanyName} - Gazette Notices - Free business summary taken from official Companies House information. Registered as ${company_number}`;
  const description = `${CompanyName} ${company_number} - Gazette Notices - company located in ${RegAddress_PostTown}, ${RegAddress_PostCode}. Check company credentials including financials, industry, and contact information from Companies House and The Gazette - Company Compass UK`;

  return {
    title,
    description,
    author: 'Company Compass',
    keywords: `${CompanyName} ${company_number} ${RegAddress_PostTown} ${RegAddress_PostCode} Gazette Notices`,
    alternates: { canonical: `https://www.companycompass.co.uk/company/${company_number}/${company_name}/gazette-notices` },
    openGraph: {
      title,
      type: 'website',
      site_name: 'Company Compass',
      description,
      url: `https://www.companycompass.co.uk/company/${company_number}/${company_name}/gazette-notices`,
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { company_number, company_name } = await params;

  const data = await getCompanyData(company_number);
  if (!data) return <div>Company not found</div>;

  const notices = await getGazetteNotices(company_number);



  const lastUpdated = new Date().toISOString();
  const formattedDate = new Date(lastUpdated).toLocaleString();

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
        <main className="max-w-4xl mx-auto p-6 bg-white rounded-lg text-gray-900">
          <h1 className="text-3xl font-bold py-5">Company Profile | {data.company_name}</h1>
          <div className="bg-white rounded-lg text-gray-900">
            <SearchForm />
          </div>
          <br />
          <div className="bg-white rounded-lg text-gray-900">
            <CompanyHeader company={data} />
            <br />
            <CompanyMenu company_number={company_number} company_name={company_name} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 items-stretch">
            <div className="border border-silver-200 p-10 rounded-lg">
              <h2 className="font-bold">Gazette Notices</h2>
              <p>
                Company events that have been published as notices in The{' '}
                <a href="https://www.thegazette.co.uk">Gazette</a>.
              </p>

              {/* Iterate over notices and display each using GazetteNotice */}
              <div className="mt-4 space-y-4">
                {notices.length > 0 ? (
                  notices.map((notice: { id: string; status: string; noticeCode: string }) => (
                    <GazetteNotice
                     key={notice.id}
                      noticeNumber={notice.id}
                     
                    />
                  ))
                ) : (
                  <p>No Gazette notices found for this company.</p>
                )}
              </div>
            </div>
          </div>
          <br />
          <p>Page last updated: {formattedDate}</p>
        </main>

        <aside className="w-full lg:w-1/3 p-4">
          <AdSlot client="ca-pub-7212919066729459" slot="9729092224" />
          <br />
          <AdSlot client="ca-pub-7212919066729459" slot="4867705256" />
        </aside>
      </div>
    </div>
  );
}
