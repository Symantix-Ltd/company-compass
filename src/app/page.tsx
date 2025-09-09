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

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto  flex flex-col lg:flex-row gap-8">
        <aside className="  order-3 lg:order-1 md:w-full sm:w-full lg:w-1/4 sm:w-1 p-5 ">

          <h2 className="text-2xl">Company Insolvency</h2>
          <h3 className="text-pink-800 text-bold py-2">Notices published in <a className="italic" href="https://www.thegazette.co.uk/all-notices">The Gazette</a> on {new Date().toLocaleDateString('en-UK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</h3>

          <NoticeBlock
            endpoint="appointment-of-administrators"
            title="Appointment of Administrators"
            linkUrl="company-notices/appointment-of-administrators/0"
          />
          <br />
          <NoticeBlock
            endpoint="winding-up-petition"
            title="Petitions to Wind Up (Companies)"
            linkUrl="company-notices/winding-up-petition/0"
          />
          <br />
          <NoticeBlock
            endpoint="appointment-of-liquidator"
            title="Appointment of Liquidator"
            linkUrl="company-notices/appointment-of-liquidator/0"
          />

          <br />
          <NoticeBlock
            endpoint="winding-up-order"
            title="Petitions to Wind Up (Companies)"
            linkUrl="company-notices/winding-up-order/0"
          />
        </aside>
        {/* Main Content */}
        <main className="order-1 lg:order-2 flex-1 p-5 ">
          <div className="xl:grid-layout gap-y-0 ">

            <h2 className="text-3xl font-bold">Company checks made simple</h2>

            <p className="text-lg text-gray-700 leading-relaxed max-w-prose mt-4">
              Our platform provides comprehensive data on UK companies, sourced directly from{" "}
              <strong className="text-gray-900">Companies House</strong> and{" "}
              <strong className="text-gray-900">The Gazette</strong>. Access official company filings, insolvency notices, and public records all in one place, making business research and compliance easier than ever.
            </p>

            <div className="mt-6">

              <SearchForm />

            </div>
<br/>
            <p><a className="underline" href="/search/person">Search for a Person</a> <a className="underline" href="/explorer/postcode">Search by Postcode</a></p>
           
          </div>

          <div className="mobile-only">
  {/* AdSense Code */} 
  <AdSlot
            format="fluid"
            layout="-gh-5+1v-2l-d"
            client="ca-pub-7212919066729459"
            slot="4685100751"
          />
  
</div>

              <section id="newsletter" >
              <h2 className="font-bold py-5 ">Newsletter</h2>
              <SubstackEmbed/>
<br/>
                <InsightsShort/>
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
        <aside className="order-2 w-full lg:order-3 lg:w-1/4 p-4">
          <AdSlot
           client="ca-pub-7212919066729459"
           slot="9729092224"
           format="auto"
          />
          <br />
          <AdSlot
             client="ca-pub-7212919066729459"
             slot="4867705256"
             format="auto"
          />
        </aside>
      </div>
    </div>
  );
}
