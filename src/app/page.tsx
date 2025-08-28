import SearchForm from './components/SearchForm';
import RssFeed from './components/RssFeed';
import Insights from './components/Insights';



export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-8">

        {/* Main Content */}
        <main className="flex-1">
          <div className="xl:grid-layout gap-y-0 mt-16 md:mt-24">
            <div className="xl:col-span-9">
              <div className="f-heading-8">
                Company checks made simple
              </div>

              <p className="text-lg text-gray-700 leading-relaxed max-w-prose mt-4">
                Our platform provides comprehensive data on UK companies, sourced directly from{" "}
                <strong className="text-gray-900">Companies House</strong> and{" "}
                <strong className="text-gray-900">The Gazette</strong>. Access official company filings, insolvency notices, and public records all in one place, making business research and compliance easier than ever.
              </p>

              <div className="mt-6">
                
                <SearchForm />
                
              </div>

              <div className="mt-6">
                <br/>
              <div className="f-heading-3">
                Company Insights
              </div>
             <p>Stay informed with the latest updates on corporate insolvencies, administrative proceedings, and official Gazette notices affecting companies across the UK.</p>
                <br/>
                <Insights/>
                
              </div>
            </div>
            
          </div>
          

          {/* Services Section */}
          <section className="mb-16 mt-16">
            <h2 id="about" className="f-heading-1">What We Offer</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700 text-lg max-w-prose mt-6">
              {[
                "Up-to-date company registration and filing data from Companies House",
                "Official insolvency and liquidation notices from The Gazette",
                "Searchable company profiles with key business insights",
                "Alerts and monitoring for changes in company status",
                "Upcoming ChatGPT-style smart search to query company info in natural language"
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
            <h2 className="f-heading-1">Contact & Support</h2>
            <p className="text-lg text-gray-700 leading-relaxed mt-4">
              Questions or feedback? Reach out to us at{" "}
              <a href="mailto:contact@symantix.co.uk" className="text-blue-600 underline hover:text-blue-800">
                contact@symantix.co.uk
              </a>.
            </p>
          </section>
        </main>

        {/* Aside / Right Column */}
        <aside className="w-full lg:w-1/3 p-4">
          <h2 className="f-heading-2">Company Events</h2>
          <div className="mt-4">
            <RssFeed />
          </div>
        </aside>
        
      </div>
    </div>
  );
}
