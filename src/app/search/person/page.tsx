export const dynamic = 'force-dynamic';

// app/search/page.tsx
import SearchFormPerson from '../../components/SearchFormPerson'; 
import AdSlot from '../../components/AdSlot';
import OfficerCard from '../../components/OfficerCard';
import NoticeBlock from '../../components/NoticeBlock';

interface OfficerResult {
  title: string;
  appointment_count: number;
  date_of_birth?: { month: number; year: number };
  links: { self: string };
  address_snippet?: string;
}

interface Props {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const query = resolvedSearchParams.q || '';
  let results: OfficerResult[] = [];

  if (query) {
    try {
      const res = await fetch(
        `${process.env.BASE_URL}/api/search/person?q=${encodeURIComponent(query)}`,
        { cache: 'no-store' }
      );
      if (res.ok) {
        results = await res.json();
        
      }
    } catch (err) {
      console.log(err);
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
          <h1 className="text-3xl font-bold mb-2">Person Search</h1>
          <p className="mb-4">Search for a person registered with Companies House</p>

          <SearchFormPerson />
          <h3 className="text-2xl font-bold mt-6 mb-4">
            <span className="font-bold">{query}</span>
          </h3>

          {results.length === 0 && query && <p>No results found.</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.map((officer) => (
              <OfficerCard key={officer.links.self} officer={officer} />
            ))}
          </div>
        </main>

        <aside className="order-2 w-full lg:order-3 lg:w-1/4 p-4">
          <AdSlot client="ca-pub-7212919066729459" slot="9729092224" />
          <br />
          <AdSlot client="ca-pub-7212919066729459" slot="4867705256" />
        </aside>
      </div>
    </div>
  );
}
