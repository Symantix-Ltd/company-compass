'use client';
import SearchForm from '../components/SearchForm'; // adjust path as needed

import { BuildingOfficeIcon } from '@heroicons/react/24/solid';


import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

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
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState<CompanyResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!queryParam) return;

    const fetchResults = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(queryParam)}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setResults(data || []);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [queryParam]);

  return (
    <main className="max-w-8xl mx-auto p-4 bg-white rounded-lg text-gray-900">

        <SearchForm/>
        <br/><br/>
      <h1 className="text-2xl font-bold mb-4">Search Results for "{queryParam}"</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

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
                <a
                  href={companyUrl}
                  className="text-blue-600 font-bold text-lg underline"
                >
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
