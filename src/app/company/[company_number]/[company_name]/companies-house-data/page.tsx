
export const revalidate = 86400;


import { getRecordFromDynamoDB } from '@/lib/dynamo';


import LatestActivityTable from '../../../../components/latestActivityTable';
import CompanyAddress from '../../../../components/companyAddress';

 
import FilingHistoryList from "../../../../components/filingHistoryList";

import Financials from '../../../../components/Financials';
import OfficerItem from '../../../../components/OfficerItem';
import Summary from '../../../../components/Summary';

import SearchForm from '../../../../components/SearchForm';

import AdSlot from '../../../../components/AdSlot';

import CompanyMenu from '../../../../components/CompanyMenu';

import CompanyHeader from '../../../../components/CompanyHeader';

import CompanyDirectors from '../../../../components/CompanyDirectors';



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

    const RegAddress_AddressLine1 = data.registered_office_address.address_line_1;
   const RegAddress_PostTown = data.registered_office_address.locality;
   const RegAddress_PostCode = data.registered_office_address.postal_code;
   const CountryOfOrigin = data.registered_office_address.country;

    const title = `${data?.company_name}. Free business summary taken from official Companies House information. Registered as ${company_number}`;


    const description = `${data?.company_name} ${company_number} is a company located in ${RegAddress_PostTown}, ${RegAddress_PostCode}. Check company credentials including financials, industry, and contact information from Companies House and The Gazette - Company Compass UK`;
    return {
        title: title,
        description: description,
        author: "Company Compass",
        keywords: `${data?.company_name} ${company_number} ${RegAddress_PostTown} ${RegAddress_PostCode}`,
        alternates: {
            canonical: `https://www.companycompass.co.uk/company/${company_number}/${company_name}/companies_house_data`,
          },
            
            openGraph: {
                title: title,
                type: "website",
                site_name: "Company Compass",
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

    /* CH officers API */
    const officer_res = await fetch(`https://api.company-information.service.gov.uk/company/${company_number}/officers`, {
        headers: { 'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}` },  next: { revalidate: 86400 }  });
    if (!officer_res.ok) {    return { notFound: true }; }
    const officer_data = await officer_res.json();


    //console.log(officer_data);

    console.log(data);
    return (
        <div className="min-h-screen w-full bg-gray-50 text-gray-900">
           
      <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
        <main className="max-w-4xl mx-auto p-6 bg-white rounded-lg  text-gray-900">
        <h1 className="text-3xl font-bold py-5">Company Profile | {data.company_name} </h1>
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
                {/* Summary company information */}
                <div className='border border-silver-200 p-10 rounded-lg flex flex-col h-full'>         
                 <Summary data={data}/>
                    </div>

               

                {/* People */}

            

<CompanyDirectors officer_data={officer_data} />
                   
                

                 {/* Financials 
                 <div id="key-financials" className='border border-silver-200 p-10 rounded-lg' >
                    <h2 className='font-bold'>Financials</h2>
                    <Financials companyNumber={data.CompanyNumber} /> 
                </div>
               */}
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

/* 
 <div className=" border border-silver-200 p-10 rounded-lg flex flex-col h-full"><h2 className=''>Gazette Notices</h2></div>

<div className="row-start-4 border border-silver-200 p-10 rounded-lg">8</div>
   <div className="row-start-5 border border-silver-200 p-10 rounded-lg">9</div>
   <div className="row-start-5 border border-silver-200 p-10 rounded-lg">10</div>*/

/*


function formatDateOfBirth({ dob }: PageProps) {
    if (!dob) return "";
    const { month, year } = dob;
    if (!month || !year) return "";
    // Simplified formatting: "Born in Oct 1966"
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    return `Born in ${monthNames[month - 1]} ${year}`;
}



*/


/*
interface YearsSinceProps {
    date: string;
}

const YearsSince: React.FC<YearsSinceProps> = ({ date }) => {
    const startDate = new Date(date);
    const today = new Date();

    const yearsSince =
        today.getFullYear() -
        startDate.getFullYear() -
        (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0);

    return yearsSince;
};
*/


/*
interface MonthsSinceProps {
    date: string;
}

const MonthsSince: React.FC<MonthsSinceProps> = ({ date }) => {


    const startDate = new Date(date);
    const today = new Date();

    const months =
        (today.getFullYear() - startDate.getFullYear()) * 12 +
        (today.getMonth() - startDate.getMonth());

    return months < 0 ? 0 : months; // avoid negative
};


*/

/*
interface MonthsUntilProps {
    date: string;
}

const MonthsUntil: React.FC<MonthsUntilProps> = ({ date }) => {
    const targetDate = new Date(date);
    const today = new Date();

    const months =
        (targetDate.getFullYear() - today.getFullYear()) * 12 +
        (targetDate.getMonth() - today.getMonth());

    return months < 0 ? 0 : months; // avoid negative
};


*/



/*

const parseDMY = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
};


const parseDate = (dateStr: string): Date => {
    if (dateStr.includes("/")) {
        // Parse as DD/MM/YYYY
        return parseDMY(dateStr);
    }
    // Otherwise, try direct parsing (ISO or other formats)
    return new Date(dateStr);
};


*/