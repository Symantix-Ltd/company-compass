'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export const dynamic = "force-dynamic";

export default function RssFeed() {
  const [groupedCompanies, setGroupedCompanies] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFeed() {
      try {
        const feedUrl = '/api/gazette/corporate_insolvency/publish_date_rss';
        const res = await axios.get(feedUrl);

        const parsed = await parseStringPromise(res.data, {
          explicitArray: false,
          mergeAttrs: true,
        });

        const entries = parsed?.rss?.channel?.item;
        const items = Array.isArray(entries) ? entries : [entries];

        const grouped = {};

        // Helper to convert to title case with lowercase 's
        const toTitleCaseWithLowercaseS = (str) =>
          str
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase())
            .replace(/`S\b/g, "'s");

        items.forEach((item) => {
          
          
          const insightUrl = item.link ;
          const guid = item.guid || `guid-${idx}`;
          const pubDate = item.pubDate || new Date().toISOString();
          const summary = item.description || '';
          
          const companyNumberMatch = insightUrl.match(/\/company\/(\d+)-/);
          const companyNumber = companyNumberMatch ? companyNumberMatch[1] : '';

        

          if (companyNumber == '') {
            // Skip this entry and go to the next
            return;
          }

          const rawCompanyName = item.title || '';
          const companyName = toTitleCaseWithLowercaseS(rawCompanyName.trim());

          
        
          const publishedDate = new Date(item.published);
          const dateString = publishedDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          });

          const uniqueKey = companyNumber;

          if (!grouped[dateString]) {
            grouped[dateString] = new Map();
          }

          if (!grouped[dateString].has(uniqueKey)) {
            grouped[dateString].set(uniqueKey, {
              companyName,
              insightUrl,
            });
          }
        });

        // Convert maps to sorted arrays
        const finalGrouped = {};
        for (const [date, companyMap] of Object.entries(grouped)) {
          const sortedCompanies = Array.from(companyMap.values()).sort((a, b) =>
            a.companyName.localeCompare(b.companyName)
          );
          finalGrouped[date] = sortedCompanies;
        }

        setGroupedCompanies(finalGrouped);
      } catch (err) {
        setError('Failed to load RSS feed');
        console.error(err);
      }
    }

    fetchFeed();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <p className="f-heading-8">Corporate Insolvency</p>
      <p>
        Recent appointment of administrators, appointment of liquidators, winding up petition notices and winding up order notices.
      </p>
      {Object.entries(groupedCompanies).map(([date, companies]) => (
        <div key={date} style={{ marginBottom: '1.5rem' }}>
          <br/>
          <ul>
            {companies.map((company, index) => (
              <li key={index}>
                <a href={company.insightUrl} style={{ textDecoration: 'underline' }}>
                  {company.companyName}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
