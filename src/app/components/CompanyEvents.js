'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

import GazetteNotice from './GazetteNotice';

export default function CompanyEvents({ companyNumber = '' }) {
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFeed() {
      try {
        const res = await axios.get(`/api/company/gazette_notices?companyNumber=${companyNumber}`);
        const data = res.data;

        const entries = data?.entry;
        if (!entries) return;

        const items = Array.isArray(entries) ? entries : [entries];

        const parsedNotices = items.map((entry) => {
          const contentText = entry?.content || '';
          const cleanText = typeof contentText === 'string' ? contentText : '';

          const summary = cleanText.length > 200 ? cleanText.slice(0, 200) + '…' : cleanText;

          const companyNumberMatch = cleanText.match(/Company Number:\s*(\w+)/i);
          const compNum = companyNumberMatch ? companyNumberMatch[1] : '';

          const companyName = entry.title || '';
          const noticeType = 'Notice'; // Can’t extract category.term from JSON version
          const publishedDate = new Date(entry.published).toLocaleDateString('en-GB');

          const slugify = (name) =>
            name?.toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';

          const gazetteUrl = entry.id;

          return {
            id: entry.id,
            companyNumber: compNum,
            companyName,
            noticeType,
            publishedDate,
            summary,
            internalUrl: compNum ? `/company/${compNum}/${slugify(companyName)}/companies-house-data` : '#',
            gazetteUrl,
          };
        });

        setNotices(parsedNotices);
      } catch (err) {
        console.error(err);
        setError('Failed to load Gazette notices');
      }
    }

    fetchFeed();
  }, [companyNumber]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!notices.length) return <p className="text-sm italic text-gray-500">No Gazette notices found.</p>;

  
  return (
    <div className="space-y-4">


{notices.map((notice) => (
  <GazetteNotice
    key={notice.id} // or another unique identifier
    noticeNumber={String(notice.gazetteUrl).split('/').pop()}
  />
))}
      <ul>
        {notices.map((notice) => (

          
          <li key={notice.id} className="border p-5 rounded-md">
            <p className="font-bold text-gray-900">{notice.noticeType}</p>
            <p className="text-sm text-gray-600 mb-1">Published: {notice.publishedDate}</p>
            <p className="text-sm text-gray-800 mb-2">{notice.summary}</p>
            {notice.gazetteUrl && (
              <a
                href={notice.gazetteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                View on The Gazette
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
