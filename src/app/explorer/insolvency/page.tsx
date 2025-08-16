'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { BuildingOfficeIcon } from '@heroicons/react/24/solid';

interface Notice {
  id: string;
  companyNumber: string;
  companyName: string;
  noticeType: string;
  insightUrl: string;
  published: string;
  dateString: string;
  summary: string;
}

interface CompanyBlock {
  companyNumber: string;
  companyName: string;
  notices: Notice[];
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function RssFeed() {
  const [companyBlocks, setCompanyBlocks] = useState<CompanyBlock[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeed() {
      try {
        const feedUrl = '/api/gazette_rss';
        const res = await axios.get(feedUrl);

        const parsed = await parseStringPromise(res.data, {
          explicitArray: false,
          mergeAttrs: true,
        });

        const entries = parsed?.feed?.entry;
        const items = Array.isArray(entries) ? entries : [entries];

        const noticesParsed: Notice[] = items.map((entry: any) => {
          const contentText = entry.content?.div?.p || entry.content?._ || '';

          const companyNumberMatch = contentText.match(/Company Number[:]*\s*(\w+)/i);
          const companyNumber = companyNumberMatch ? companyNumberMatch[1] : '';

          const companyName = entry.title || '';
          const noticeType = entry.category?.term || 'Notice';

          const insightUrl = companyNumber
            ? `/insight/company/${companyNumber}-${slugify(companyName)}`
            : '#';

          const publishedDate = new Date(entry.published);
          const dateString = publishedDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          });

          const summary = contentText.length > 150
            ? contentText.slice(0, 150) + '...'
            : contentText;

          return {
            id: entry.id,
            companyNumber,
            companyName,
            noticeType,
            insightUrl,
            published: entry.published,
            dateString,
            summary,
          };
        });

        // Group by company
        const groupedByCompany: Record<string, CompanyBlock> = {};
        noticesParsed.forEach((notice) => {
          const key = notice.companyNumber || notice.companyName;
          if (!groupedByCompany[key]) {
            groupedByCompany[key] = {
              companyNumber: notice.companyNumber,
              companyName: notice.companyName,
              notices: [],
            };
          }
          groupedByCompany[key].notices.push(notice);
        });

        // Sort notices within each company by newest first
        Object.values(groupedByCompany).forEach((company) => {
          company.notices.sort(
            (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
          );
        });

        // Sort companies alphabetically
        const sortedCompanyBlocks = Object.values(groupedByCompany).sort((a, b) =>
          a.companyName.localeCompare(b.companyName)
        );

        setCompanyBlocks(sortedCompanyBlocks);
      } catch (err) {
        setError('Failed to load RSS feed');
        console.error(err);
      }
    }

    fetchFeed();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <main className="max-w-6xl mx-auto p-6 bg-white rounded-lg text-gray-900">
      <br />
      <h1 className="text-2xl font-bold mb-4">Corporate Insolvency Events</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
        {companyBlocks.map((company) => {
        // Skip companies without a company number
        if (!company.companyNumber) return null;

          const slug = `${company.companyNumber}-${slugify(company.companyName)}`;
          const companyUrl = `/insight/company/${slug}`;
            
          return (
            <div
              key={company.companyNumber || company.companyName}
              className="border p-4 rounded shadow-md flex gap-4"
            >
              <div className="w-16 h-16 flex-shrink-0">
                <BuildingOfficeIcon className="size-8 text-blue-500" />
              </div>
              <div className="flex-1">
                <a
                  href={companyUrl}
                  className="text-blue-600 font-bold text-lg "
                >
                  {company.companyName}
                </a>
                <p className="text-gray-500 text-sm mb-2">
                  Company Number: {company.companyNumber || 'N/A'}
                </p>

                <div className="space-y-2">
                  {company.notices.map((notice) => (

                    
                    <div key={notice.id} className=" pt-2">
                      <span
                        
                        className="font-semibold   block mb-1"
                      >
                        {notice.noticeType}
                      </span>
                      <span className="text-gray-500 text-sm block mb-1">
                        Published: {notice.dateString}
                      </span>
                      {notice.summary && (
                        <p className="text-gray-800 text-sm">{notice.summary}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
