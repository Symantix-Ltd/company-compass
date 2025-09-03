'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export default function CompanyEvents({ companyNumber = '' }) {
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFeed() {
      try {
        const res = await axios.get(`/api/gazette_company_rss?companyNumber=${companyNumber}`);
        const parsed = await parseStringPromise(res.data, { explicitArray: false, mergeAttrs: true });

        const entries = parsed?.feed?.entry;
        if (!entries) return;

        const items = Array.isArray(entries) ? entries : [entries];

        const parsedNotices = items.map((entry) => {
          // Content summary
          let contentText = '';
          if (entry.content?.div?.p) {
            contentText = Array.isArray(entry.content.div.p)
              ? entry.content.div.p.join(' ')
              : entry.content.div.p;
          } else if (entry.content?._) {
            contentText = entry.content._;
          }

          const summary = contentText.length > 200 ? contentText.slice(0, 200) + '…' : contentText;

          const companyNumberMatch = contentText.match(/Company Number:\s*(\w+)/i);
          const compNum = companyNumberMatch ? companyNumberMatch[1] : '';

          const companyName = entry.title || '';
          const noticeType = entry.category?.term || 'Notice';
          const publishedDate = new Date(entry.published).toLocaleDateString('en-GB');

          const slugify = (name) =>
            name.toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

          // External Gazette link
          const gazetteUrl = Array.isArray(entry.link)
            ? entry.link.find(l => !l.rel || l.rel !== 'self')?.href
            : entry.link?.href;

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
        setError('Failed to load RSS feed');
      }
    }

    fetchFeed();
  }, [companyNumber]);

  if (error) return <p>{error}</p>;
  if (!notices.length) return <p className='text-sm'><i></i></p>;

  return (
    <div>
      
    <ul>
      {notices.map((notice) => (
        <li key={notice.id} style={{ marginBottom: '1.5rem' }} className="border p-5">
          <p style={{ fontWeight: 'bold' }}>
            {notice.noticeType}
          </p>
          <div style={{ fontSize: '0.9rem', color: '#555', margin: '0.25rem 0' }}>
            Published: {notice.publishedDate}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#333', marginBottom: '0.25rem' }}>
            {notice.summary}
          </div>
          {notice.gazetteUrl && (
            <a
              href={notice.gazetteUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.85rem', color: 'blue' }}
            >
              source: The Gazette
            </a>
          )}
        </li>
      ))}
    </ul>
    </div>
  );
}
