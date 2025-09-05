export const dynamic = 'force-dynamic';

// app/search/page.tsx
import SearchFormPerson from '../../components/SearchFormPerson'; 
import AdSlot from '../../components/AdSlot';
import OfficerCard from '../../components/OfficerCard';

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
        console.log(results);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
        <main className="max-w-6xl mx-auto p-6 bg-white rounded-lg text-gray-900">
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

        <aside className="w-full lg:w-1/4 p-4">
          <AdSlot client="ca-pub-7212919066729459" slot="9729092224" />
          <br />
          <AdSlot client="ca-pub-7212919066729459" slot="4867705256" />
        </aside>
      </div>
    </div>
  );
}
