
export const revalidate = 86400;


import { getRecordFromDynamoDB } from '@/lib/dynamo';


import Financials from '../../../../components/Financials';

import SearchForm from '../../../../components/SearchForm';

import AdSlot from '../../../../components/AdSlot';

import CompanyMenu from '../../../../components/CompanyMenu';
import CompanyHeader from '../../../../components/CompanyHeader';

interface Params {
        company_number: string;
        company_name: string;
      };

// No pre-rendered pages
export async function generateStaticParams(): Promise<Params[]> {
    return [];
  }
  

async function getCompanyData(company_number: string) {
    const data = await getRecordFromDynamoDB(company_number);
    return data;
}


export async function generateMetadata(
    { params }: { params: Promise<Params> }) {
    const { company_number, company_name } = await params;
    

    const data = await getCompanyData(company_number);

    const title = `${data?.CompanyName}. Free business summary taken from official Companies House information. Registered as ${company_number}`;


    const description = `${data?.CompanyName} ${company_number} is a company located in ${data?.RegAddress_PostTown}, ${data?.RegAddress_PostCode}. Check company credentials including financials, industry, and contact information from Companies House and The Gazette - Company Compass UK`;
    return {
        title: title,
        description: description
            ,
            openGraph: {
                title: title,
                description: description,
                url: `https://www.companycompass.co.uk/company/${company_number}/${company_name}/companies_house_data`
               
              },
    };
}






export default async function Page({ params }: { params: Promise<Params> }) {
    
    const { company_number, company_name } = await params;

    console.log(`[SSR] Rendering page for id: ${company_number} at ${new Date().toISOString()}`);

    /* last date page was updated  */
    const lastUpdated = new Date().toISOString();
    const formattedDate = new Date(lastUpdated).toLocaleString();
   
    /* CH API KEY */
    const apiKey = process.env.CH_API_KEY;
   
    // [id, ...companyParts] = p.id.split("-");
   // const cName = companyParts.join(" ");

    const data = await getCompanyData(company_number);
    if (!data) { return <div>Company not found</div>; }

   

    return (
        <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
        <main className="max-w-4xl mx-auto p-6 bg-white rounded-lg  text-gray-900">
        <h1 className="text-3xl font-bold py-5">Company Profile | {data.CompanyName} </h1>
            <div className=" bg-white rounded-lg  text-gray-900" >
               
            <SearchForm/>
            

    
            </div>
            <br/>
            <div className="bg-white rounded-lg  text-gray-900 ">

      {/* Header */}
      <CompanyHeader company={data} />
              
<br/>
            <CompanyMenu   company_number={company_number} company_name={company_name} />

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 items-stretch ">
              
               

               
                

                 {/* Financials */}
                 <div className='border border-silver-200 p-10 rounded-lg' >
                    <h2 className='font-bold'>Financials</h2>
                    <Financials companyNumber={data.CompanyNumber} /> 
                </div>
               
            </div>
            <br />

            

            <p>Page last updated: {formattedDate}</p>
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
