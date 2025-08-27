'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { BuildingOfficeIcon } from '@heroicons/react/24/solid';

export const dynamic = 'force-dynamic';

interface RssFeedProps {
  feedUrl?: string;
}

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



export default function RssFeed({ feedUrl }: RssFeedProps) {
  const [companyBlocks, setCompanyBlocks] = useState<CompanyBlock[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeed() {
      try {
        const url = feedUrl || '/api/gazette/corporate_insolvency/publish_date_rss';
        const res = await axios.get(url, { responseType: 'text' });

        const parsed = await parseStringPromise(res.data, {
          explicitArray: false,
          mergeAttrs: true,
        });

        const items = parsed?.rss?.channel?.item;
        if (!items) throw new Error('Invalid RSS feed format');

        const itemList = Array.isArray(items) ? items : [items];

        const notices: Notice[] = itemList.map((item: any, idx: number) => {
          const companyName = item.title ;
          const insightUrl = item.link ;
          const guid = item.guid || `guid-${idx}`;
          const pubDate = item.pubDate || new Date().toISOString();
          const summary = item.description || '';
          
          const companyNumberMatch = insightUrl.match(/\/company\/(\d+)-/);
          const companyNumber = companyNumberMatch ? companyNumberMatch[1] : '';

          const dateString = new Date(pubDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          });

          return {
            id: `${guid}-${pubDate}`,
            companyNumber,
            companyName,
            insightUrl,
            published: pubDate,
            dateString,
            
          };
        });

        // Group by company number
        const grouped: Record<string, CompanyBlock> = {};
        for (const notice of notices) {
          const key = notice.companyNumber;
          if (!grouped[key]) {
            grouped[key] = {
              companyNumber: notice.companyNumber,
              companyName: notice.companyName,
              notices: [],
            };
          }
          grouped[key].notices.push(notice);
        }

        // Sort notices and companies
        Object.values(grouped).forEach((company) => {
          company.notices.sort(
            (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
          );
        });

        const sortedCompanies = Object.values(grouped).sort((a, b) =>
          a.companyName.localeCompare(b.companyName)
        );

        setCompanyBlocks(sortedCompanies);
      } catch (err) {
        setError('Failed to load RSS feed');
        console.error(err);
      }
    }

    fetchFeed();
  }, [feedUrl]);

  if (error) return <p>{error}</p>;

  return (
    <main className="max-w-6xl mx-auto p-6 bg-white rounded-lg text-gray-900">
      <h1 className="f-heading-8 mb-4">Corporate Insolvency Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
        {companyBlocks.map((company) => {
          if (!company.companyNumber) return null;

          
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
                  href={company.notices[0].insightUrl}
                  className="text-blue-600 font-bold text-lg"
                >
                  {company.companyName}
                </a>
                <p className="text-gray-500 text-sm mb-2">
                  Company Number: {company.companyNumber || 'N/A'}
                </p>

                <div className="space-y-2">
                  {company.notices.map((notice) => (
                    <div key={notice.id} className="pt-2">
                      
                      
                      
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
