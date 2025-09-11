import SearchForm from './components/SearchForm';
import SearchFormPerson from './components/SearchFormPerson';
import SearchFormPostcode from './components/SearchFormPostcode';
import RssFeed from './components/RssFeed';
import Insights from './components/Insights';
import AdSlot from './components/AdSlot';
import NoticeBlock from './components/NoticeBlock';
import { BuildingOfficeIcon } from '@heroicons/react/24/solid';
import InsightsShort from './components/InsightsShort';
import SubstackEmbed from './components/SubstackEmbed';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

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

interface CompanyBlock {
  companyName: string;
  companyNumber: string;
  insightUrl: string;
  notices: Notice[];
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default async function Home() {

  const InsolvencyNotices = () => (
    <div>
      <h2 className="text-2xl">Company Insolvency</h2>
      <p className="text-pink-800 font-bold py-2">
        Insolvency notices published in <a href="https://www.thegazette.co.uk/all-notices">The Gazette</a> 
        </p>
        <p><span className=" text-pink-800 font-bold py-2 bg-pink-100 border text-brown font-semibold p-1 rounded">
          {new Date().toLocaleDateString('en-UK', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </p>
      <br/>

      <NoticeBlock
        endpoint="appointment-of-administrators"
        title="Appointment of Administrators"
        linkUrl="company-notices/appointment-of-administrators"
      />
      <NoticeBlock
        endpoint="winding-up-petition"
        title="Petitions to Wind Up (Companies)"
        linkUrl="company-notices/winding-up-petition"
      />
      <NoticeBlock
        endpoint="appointment-of-liquidator"
        title="Appointment of Liquidator"
        linkUrl="company-notices/appointment-of-liquidator"
      />
      <NoticeBlock
        endpoint="winding-up-order"
        title="Winding-Up Order"
        linkUrl="company-notices/winding-up-order"
      />
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex order-3 lg:order-1 lg:w-1/4 p-5 flex-col gap-4">
          <InsolvencyNotices />
        </aside>

        {/* Main Content */}
        <main className="order-1 lg:order-2 flex-1 p-5">
          <h2 className="text-3xl font-bold">Company checks made simple</h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-prose mt-4">
            Our platform provides comprehensive data on UK companies, sourced directly from{" "}
            <strong className="text-gray-900">Companies House</strong> and{" "}
            <strong className="text-gray-900">The Gazette</strong>. Access official company filings, insolvency notices, and public records all in one place, making business research and compliance easier than ever.
          </p>

          {/* Search Form */}
          <div className="mt-6">
            <SearchForm />
          </div>
             {/* Search by Person/Postcode */}
             <p className="mt-4">
              <p>As well as searching by company name, you can search by person name and postcode:</p><br/>
            <a className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mr-2" href="/search/person">Search for a Person</a>
            <a className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded" href="/explorer/postcode">Search by Postcode</a>
          </p>

          {/* Mobile Insolvency Notices - under search form */}
          <div className="lg:hidden mt-6 py-5">
            <InsolvencyNotices />
          </div>

       

         
         

          {/* Newsletter */}
          <section id="newsletter" className="mt-6">
            <h2 className="font-bold py-5">Newsletter</h2>
            <SubstackEmbed />
            <br />
            <InsightsShort />
          </section>

          {/* Services Section */}
          <section className="mb-16 mt-16">
            <h2 id="about" className="font-bold">What We Offer</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700 text-lg max-w-prose mt-6">
              {[
                "Up-to-date company registration and filing data from Companies House",
                "Official insolvency and liquidation notices from The Gazette",
                "Searchable company profiles with key business insights",
                "Alerts and monitoring for changes in company status",
              ].map((text, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <span className="inline-block mt-1 text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Contact Section */}
          <section id="contact" className="mb-16 max-w-prose">
            <h2 className="font-bold">Contact & Support</h2>
            <p className="text-lg text-gray-700 leading-relaxed mt-4">
              Questions or feedback? Reach out to us at{" "}
              <a href="mailto:contact@symantix.co.uk" className="text-blue-600 underline hover:text-blue-800">
                contact@symantix.co.uk
              </a>.
            </p>
          </section>
        </main>

        {/* Right Sidebar */}
        <aside className="order-2 w-full lg:order-3 lg:w-1/4 p-4">
          <AdSlot client="ca-pub-7212919066729459" slot="9729092224" format="auto" />
          <br />
          <AdSlot client="ca-pub-7212919066729459" slot="4867705256" format="auto" />
        </aside>
      </div>
    </div>
  );
}
