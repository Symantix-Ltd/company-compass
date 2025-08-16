'use client'; 

export const dynamic = "force-dynamic";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export default function RssFeed() {
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState(null);

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

        const noticesParsed = items.map((entry) => {

      
          const contentText =
            entry.content?.div?.p || entry.content?._ || '';

          // Extract company number
        const companyNumberMatch = contentText.match(/Company Number[:]*\s*(\w+)/i);
        const companyNumber = companyNumberMatch ? companyNumberMatch[1] : '';

       

          // Company name from title
        const companyName = entry.title || '';

        

          // Notice type from category
          const noticeType = entry.category?.term || 'Notice';

          // Slugify company name
          const slugify = (name) =>
            name
              .toLowerCase()
              .replace(/\./g, '') 
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '');

       

          // Generate URL
          const insightUrl = companyNumber ? `/insight/company/${companyNumber}-${slugify(companyName)}`
            : '#';

       

          // Format date
          const publishedDate = new Date(entry.published);
          const dateString = publishedDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          });

          return {
            id: entry.id,
            companyNumber,
            companyName,
            noticeType,
            insightUrl,
            published: entry.published,
            dateString,
          };
        });

        setNotices(noticesParsed);
      } catch (err) {
        setError('Failed to load RSS feed');
        console.error(err);
      }
    }

    fetchFeed();
  }, []);

  if (error) return <p>{error}</p>;

  // Group notices by date
  const groupedByDate = notices.reduce((acc, notice) => {
    if (!acc[notice.dateString]) acc[notice.dateString] = [];
    acc[notice.dateString].push(notice);
    return acc;
  }, {});

  return (
    <div>
      <p className='f-heading-8'>Corporate Insolvency</p>
      <p>
        Recent appointment of administrators, appointment of liquidators, winding up petition notices and winding up order notices.
      </p>

      {Object.entries(groupedByDate).map(([date, noticesOnDate]) => (
        <div key={date} style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{date}</p>

          {noticesOnDate.map((notice) => (
            <div key={notice.id} style={{ marginBottom: '0.5rem' }}>
              <a
                href={notice.insightUrl}
                style={{
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  display: 'block',
                  textDecoration: 'underline',
                  marginBottom: '2px',
                }}
              >
                 {notice.companyName} - {notice.noticeType}
              </a>
            
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}


/*
  <span
                style={{
                  fontSize: '0.8rem',
                  color: '#888',
                  display: 'block',
                }}
              >
                {notice.noticeType} - {notice.companyName}
              </span>

              */
