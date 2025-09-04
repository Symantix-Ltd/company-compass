'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function CompanySummary() {
  const params = useParams();
  const companyNumber = params.company_number;
  const companyName = params.company_name;

  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        if (!companyNumber || !companyName) {
          setError('Company number and name are required.');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/company-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ companyNumber, companyName }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch summary');

        setSummary(data.summary);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [companyNumber, companyName]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      

      {loading && <p>Loading summary...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {summary && (
        <div
          className="mt-4 p-4 prose"
          dangerouslySetInnerHTML={{ __html: summary }}
        />
      )}
    </div>
  );
}
