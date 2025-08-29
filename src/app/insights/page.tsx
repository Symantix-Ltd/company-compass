
import Insights from '../components/Insights';



export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-8">

        {/* Main Content */}
        <main className="flex-1">
          <div className="xl:grid-layout gap-y-0 mt-16 md:mt-24">
            <div className="xl:col-span-9">
             

              <div className="mt-6">
               
              <div className="f-heading-3">
                Company Insights
              </div>
             <p>Stay informed with the latest updates on corporate insolvencies, administrative proceedings, and official Gazette notices affecting companies across the UK.</p>
                <br/>
                <Insights/>
                
              </div>
            </div>
            
          </div>
          

         
        </main>

        
      </div>
    </div>
  );
}
