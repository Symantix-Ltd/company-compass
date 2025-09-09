'use client';

import { useEffect, useState } from 'react';

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
      const insightUrl = `/company/${slug}`;

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


type NoticeBlockProps = React.HTMLAttributes<HTMLDivElement> & {
    endpoint: string;
    title: string;
    linkUrl?: string;
  };

  

export default function NoticeBlock({
  endpoint,
  title,
  linkUrl,
}: {
  endpoint: string;
  title: string;
  linkUrl?: string;
}) {


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

  if (loading) return <p className="italic"></p>;
  if (notices.length === 0) return ( 
  
    <div className="p-4 bg-blue-100 rounded">
      <p className="text-blue-600 font-bold  py-2">{title}</p>
      <p>No recent notices found.</p>
      {linkUrl && (
        <p className="mt-1 text-sm py-5">
          <a className="italic" href={linkUrl}>View all {title} notices</a>
          
        </p>
        
      )}
      </div>


  );

  return (
    <div className="p-4 bg-blue-100 rounded">
      <p className="text-blue-600 font-bold  py-2">{title}</p>
      
    
      <ul className="mt-4 list-decimal list-inside space-y-1">
        {notices.slice(0, 5).map((notice) => (
          <li key={notice.id}>
            <a href={notice.insightUrl} className="text-blue-500 underline text-sm">
              {notice.companyName}
            </a>
          </li>
        ))}
      </ul>

      {linkUrl && (
        <p className="mt-1 text-sm py-5">
          <a className="italic" href={linkUrl}>View all {title} notices</a>
          
        </p>
        
      )}
    </div>
  );
}

