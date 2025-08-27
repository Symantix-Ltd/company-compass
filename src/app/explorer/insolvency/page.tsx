// src/app/explorer/insolvency/page.tsx

import { BuildingOfficeIcon } from '@heroicons/react/24/solid';

interface Notice {
  id: string;
  companyName: string;
  companyNumber: string;
  noticeType: string;
  insightUrl: string;
  published: string;
  dateString: string;
  summary: string;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const dynamic = 'force-static'; // make sure it's statically generated
export const revalidate = 3600; // rebuild every hour

export default async function InsolvencyPage() {
  const res = await fetch(`${process.env.BASE_URL}/api/gazette/corporate_insolvency/publish_date_all`, {
    next: { revalidate },
  });

  if (!res.ok) {
    console.error('Failed to fetch insolvency data');
    return <div>Failed to load data.</div>;
  }

  const json = await res.json();
  const entries = Array.isArray(json) ? json : json?.entry || [];

  const notices: Notice[] = entries.map((entry: any) => {
    const id = entry.id;
    const companyName = entry.title;
    const content = entry.content || '';
    const published = entry.published;
    const category = entry.category?.['@term'] || 'Notice';

    // Try to extract company number from content (e.g., "Company Number: 12345678")
    const companyNumberMatch = content.match(/Company Number[:]*\s*(\w+)/i);
    const companyNumber = companyNumberMatch ? companyNumberMatch[1] : '';

    const date = new Date(published);
    const dateString = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const summary = content.replace(/<[^>]*>/g, '').slice(0, 200) + '...';

    const slug = `${companyNumber || 'no-number'}-${slugify(companyName)}`;
    const insightUrl = `/insight/company/${slug}`;

    return {
      id,
      companyName,
      companyNumber,
      noticeType: category,
      insightUrl,
      published,
      dateString,
      summary,
    };
  });

  // Group notices by publish date
  const groupedByDate: Record<string, Notice[]> = {};
  for (const notice of notices) {
    if (!groupedByDate[notice.dateString]) {
      groupedByDate[notice.dateString] = [];
    }
    groupedByDate[notice.dateString].push(notice);
  }

  return (
    <main className="max-w-6xl mx-auto p-6 bg-white rounded-lg text-gray-900">
      <h1 className="f-heading-8 mb-4">Corporate Insolvency Notices</h1>
      
      {Object.entries(groupedByDate).map(([date, notices]) => (
        <section key={date} className="mb-10">
          <h2 className="text-xl font-semibold mb-3">{date}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {notices.map((notice) => (
              <div key={notice.id} className="border p-4 rounded shadow-sm flex gap-4">
                <div className="w-10 h-10 flex-shrink-0">
                  <BuildingOfficeIcon className="size-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <a href={notice.insightUrl} className="text-blue-600 font-bold text-base">
                    {notice.companyName}
                  </a>
                  <p className="text-sm text-gray-500">
                    {notice.noticeType}
                    {notice.companyNumber && (
                      <> &middot; Company Number: {notice.companyNumber}</>
                    )}
                  </p>
                  <p className="text-sm mt-1 text-gray-700">{notice.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
