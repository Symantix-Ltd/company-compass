'use client';

import { useEffect, useState } from 'react';
import AdSlot from './AdSlot';
interface Notice {
  id: string;
  companyName: string;
  companyNumber: string;
  insightUrl: string;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fetchNotices(endpoint: string): Promise<Notice[]> {
  try {
    const res = await fetch(`/api/gazette/company-insolvency/${endpoint}`);
    if (!res.ok) throw new Error('Failed to fetch');

    const json = await res.json();
    const entries = Array.isArray(json) ? json : json?.entry || [];

    const notices = entries.flatMap((entry: any) => {
      const id = entry.id;
      const companyName = entry.title?.replace(/\n/g, '').replace(/\/n|\/N/g, '').trim();
      const content = entry.content || '';
      const companyNumberMatch = content.match(/Company Number[:]*\s*(\w+)/i);
      const companyNumber = companyNumberMatch ? companyNumberMatch[1] : '';
      if (!companyNumber || !companyName) return [];

      const slug = `${companyNumber}/${slugify(companyName)}`;
      const insightUrl = `/company/${slug}/gazette-notices`;

      return {
        id,
        companyName,
        companyNumber,
        insightUrl,
      };
    });

    notices.sort((a: Notice, b: Notice) => a.companyName.localeCompare(b.companyName));

    return notices;
  } catch (err) {
    console.error('Error loading notices:', err);
    return [];
  }
}

type NoticeBlockProps = {
  endpoint: string;
  title: string;
  linkUrl?: string;
};

export default function NoticeBlock({
  endpoint,
  title,
  linkUrl,
}: NoticeBlockProps) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const date = `${yyyy}-${mm}-${dd}`;

  linkUrl = linkUrl + "/" + date;

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices(endpoint).then((data) => {
      setNotices(data);
      setLoading(false);
    });
  }, [endpoint]);

  if (loading) return <p className="italic text-sm text-gray-500">Loading...</p>;

  if (notices.length === 0) {
    return (
      <div>
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
        <p className="text-lg font-semibold text-blue-700 mb-2">{title}</p>
        <p className="text-sm text-gray-700">No recent notices found.</p>
        {linkUrl && (
          <p className="mt-4 text-sm">
            <a className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded" href={linkUrl}>
              View all  notices
            </a>
          </p>
        )}
      </div>
      
    <br/>
      </div>
    );
  }

  return (
    <div>
    <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
      <p className="text-lg font-semibold text-blue-700 mb-4">{title}</p>

      <ul className="list-decimal list-inside space-y-2 text-sm text-blue-800">
        {notices.slice(0, 5).map((notice) => (
          <li key={notice.id}>
            <a
              href={notice.insightUrl}
              className="hover:text-blue-600 hover:underline transition"
            >
              {notice.companyName}
            </a>
          </li>
        ))}
      </ul>

      {linkUrl && (
        <p className="mt-6 text-sm">
          <a className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded" href={linkUrl}>
            View all  notices
          </a>
        </p>
      )}

  
    </div>
   <br/>
    </div>
  );
}



//  <AdSlot client="ca-pub-7212919066729459" slot="3616998459" />
//<AdSlot client="ca-pub-7212919066729459" slot="3616998459"/>