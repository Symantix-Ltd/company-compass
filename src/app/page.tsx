import SearchForm from './components/SearchForm'; // adjust path as needed


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
    
  
    {/* Main content */}
    <main className="max-w-6xl mx-auto p-6">
      {/* Include the search form */}

      <div className="xl:grid-layout gap-y-0 mt-16 md:mt-24">
        <div className="xl:col-span-9">
            <div className="f-heading-7" >
            Company checks made simple
            </div>
                           

                  

        <p className="text-lg text-gray-700 leading-relaxed max-w-prose">
          Our platform provides comprehensive data on UK companies, sourced directly from{" "}
          <strong className="text-gray-900">Companies House</strong> and{" "}
          <strong className="text-gray-900">The Gazette</strong>. Access official company filings, insolvency notices, and public records all in one place, making business research and compliance easier than ever.
        </p>
        <br/>
  <SearchForm />
  </div>
  </div>
  <br/><br/>
      {/* Intro Section */}
      <section className="mb-16">
 
      </section>

      {/* Services Section */}
      <section className="mb-16">
        <h2 id="about" className="f-heading-1">What We Offer</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700 text-lg max-w-prose">
          <li className="flex items-start space-x-3">
            <span className="inline-block mt-1 text-blue-600">
              {/* Heroicon Check Circle */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span>Up-to-date company registration and filing data from Companies House</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="inline-block mt-1 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span>Official insolvency and liquidation notices from The Gazette</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="inline-block mt-1 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span>Searchable company profiles with key business insights</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="inline-block mt-1 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span>Alerts and monitoring for changes in company status</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="inline-block mt-1 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span>Upcoming ChatGPT-style smart search to query company info in natural language</span>
          </li>
        </ul>
      </section>

      {/* Contact Section */}
      <section id="contact" className="mb-16 max-w-prose">
        
        <h2 className="f-heading-1">Contact & Support</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Questions or feedback? Reach out to us at{" "}
          <a href="mailto:contact@symantix.co.uk" className="text-blue-600 underline hover:text-blue-800">
            contact@symantix.co.uk
          </a>
          .
        </p>
      </section>

     
      
    </main>
  </div>
  );
}
