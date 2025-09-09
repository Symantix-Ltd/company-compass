import Insights from '../components/Insights';
import AdSlot from '../components/AdSlot';
import SubstackEmbed from '../components/SubstackEmbed';
import { parseStringPromise } from 'xml2js';

// Type for a Substack RSS item
interface RssItem {
  guid: Array<{ _: string } | string>;
  title: string[];
  'content:encoded': string[];
}

// Type for post passed to Insights
export interface Post {
  guid: string;
  title: string;
  content: string;
}

async function getPosts(): Promise<Post[]> {
  const substackRssUrl = 'https://companycompass.substack.com/feed';

  try {
    const res = await fetch(substackRssUrl, {
      next: { revalidate: 3600 }, // Rebuild every hour
    });
    const xml = await res.text();
    const parsed = await parseStringPromise(xml);
    const items: RssItem[] = parsed.rss.channel[0].item;

    return items.slice(0, 10).map((item: RssItem) => ({
      guid: typeof item.guid[0] === 'string' ? item.guid[0] : item.guid[0]._,
      title: item.title[0],
      content: item['content:encoded'][0],
    }));
  } catch (err) {
    console.error('Failed to fetch Substack feed:', err);
    return [];
  }
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-5">
        <main className="max-w-6xl mx-auto p-6 bg-white rounded-lg text-gray-900">
          <h1 className="text-3xl font-bold">Company Newsletter</h1>
          <p>
            Stay informed with the latest updates on corporate insolvencies,
            administrative proceedings, and official Gazette notices affecting
            companies across the UK.
          </p>
          <br />
          <SubstackEmbed />
          <Insights posts={posts} />
        </main>

        <aside className="w-full lg:w-1/3 p-4">
          <AdSlot client="ca-pub-7212919066729459" slot="9729092224" />
          <br />
          <AdSlot client="ca-pub-7212919066729459" slot="4867705256" />
        </aside>
      </div>
    </div>
  );
}
