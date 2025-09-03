
import Insights from '../components/Insights';

import AdSlot from '../components/AdSlot'


export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
    <main className="max-w-6xl mx-auto p-6 bg-white rounded-lg text-gray-900">
    <br/>
  <h1 className=" text-4xl font-bold">Company Insights</h1>
<p>Stay informed with the latest updates on corporate insolvencies, administrative proceedings, and official Gazette notices affecting companies across the UK</p>
 
<br/>
                
               
                <Insights/>
                
              

         
        </main>
        <aside className="w-full lg:w-1/3 p-4">
          
       

          <AdSlot
                    client="ca-pub-7212919066729459" 
                    slot="9729092224"            
                  />
          
          <br/>    
          
          <AdSlot
                    client="ca-pub-7212919066729459" 
                    slot="4867705256"            
                  />
          
                  </aside>
</div>
</div>
        
     
  );
}
