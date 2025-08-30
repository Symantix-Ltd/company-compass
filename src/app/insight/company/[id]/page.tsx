
export const revalidate = 86400;


import { getRecordFromDynamoDB } from '@/lib/dynamo';


import LatestActivityTable from '../../../components/latestActivityTable';
import CompanyAddress from '../../../components/companyAddress';

import CompanyEvents from '../../../components/CompanyEvents';

import FilingHistoryList from "../../../components/filingHistoryList";

import Financials from '../../../components/Financials';
import OfficerItem from '../../../components/OfficerItem';
import Summary from '../../../components/Summary';

import SearchForm from '../../../components/SearchForm'; // adjust path as needed


interface Params {
        id: string;
      };

// No pre-rendered pages
export async function generateStaticParams(): Promise<Params[]> {
    return [];
  }
  

async function getCompanyData(id: string) {
    const data = await getRecordFromDynamoDB(id);
    return data;
}
interface Params {
    id: string;
  };

export async function generateMetadata(
    { params }: { params: Promise<Params> }) {
    const { id } = await params;
    const companyId = id.split("-")[0];

    const data = await getCompanyData(companyId);

    const title = `${data?.CompanyName} - Company Profile - Company Compass`;

    const description = `${data?.CompanyName} ${companyId} is a company located in ${data?.RegAddress_PostTown}, ${data?.RegAddress_PostCode}. Get insights into the company including financials, industry, Gazette and contact information.`;
    return {
        title: title,
        description: description
            ,
            openGraph: {
                title: title,
                description: description,
                url: `https://www.companycompass.co.uk/insight/company/${id}`
               
              },
    };
}






export default async function Page({ params }: { params: Promise<Params> }) {
    
    const { id } = await params;

    console.log(`[SSR] Rendering page for id: ${id} at ${new Date().toISOString()}`);



    // page parameters
    const companyId = id.split("-")[0];

    /* last date page was updated  */
    const lastUpdated = new Date().toISOString();
    const formattedDate = new Date(lastUpdated).toLocaleString();
   
    /* CH API KEY */
    const apiKey = process.env.CH_API_KEY;
   
    // [id, ...companyParts] = p.id.split("-");
   // const cName = companyParts.join(" ");

    const data = await getCompanyData(companyId);
    if (!data) { return <div>Company not found</div>; }

    /* CH officers API */
    const officer_res = await fetch(`https://api.company-information.service.gov.uk/company/${companyId}/officers`, {
        headers: { 'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}` },  next: { revalidate: 86400 }  });
    if (!officer_res.ok) {    return { notFound: true }; }
    const officer_data = await officer_res.json();


    /* CH filing history API */
    const filing_res = await fetch(`https://api.company-information.service.gov.uk/company/${companyId}/filing-history`, {
        headers: { 'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`   },  next: { revalidate: 86400 } });
    if (!filing_res.ok) {  return { notFound: true }; }
    const filing_data = await filing_res.json();
    //console.log(filing_data)


    return (

        <main className="max-w-6xl mx-auto p-6 bg-white rounded-lg  text-gray-900">
            <div >
                <br/>
            <SearchForm/>
            <br/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch ">
                {/* Summary company information */}
                <div className='border border-silver-200 p-10 rounded-lg flex flex-col h-full'>         
                 <Summary data={data}/>
                    </div>

                {/* Company Events */}
                <div className='border border-silver-200 p-10 rounded-lg' >
                <h1 className='f-heading-1'>Company Events</h1>
                
                
                    <CompanyEvents companyNumber={data.CompanyNumber} /> 
                </div>

                {/* Contact */}
                <div className=" border border-silver-200 p-10 rounded-lg flex flex-col h-full">
                    <h1 className='f-heading-1'>Contact</h1>
                    <CompanyAddress data={data} />
                </div>

                <div className=" border border-silver-200 p-10 rounded-lg flex flex-col h-full">
                    <h1 className='f-heading-1'>Latest Activity</h1>
                    <LatestActivityTable latestActivity={filing_data} />
                </div>

                {/* People */}

                <div className="border border-silver-200 p-10 rounded-lg flex flex-col h-full">
                    <h1 className='f-heading-1'>People</h1>
                    <div>
                    {officer_data.items?.map((officer:any, index:number) => (
  <OfficerItem 
    key={`${officer.person_number ?? officer.name}-${index}`} 
    officer={officer} 
  />
)) || <li>No officers found</li>}
                    </div>
                </div>

                { /* Documents */}

                <div className=" border border-silver-200 p-10 rounded-lg flex flex-col h-full"><h1 className='f-heading-1'>Documents</h1>
                    <br />
                    <FilingHistoryList filings={filing_data} companyNumber={data.CompanyNumber} />
                </div>

                 {/* Financials */}
                 <div className='border border-silver-200 p-10 rounded-lg' >
                    <h1 className='f-heading-1'>Financials</h1>
                    <Financials companyNumber={data.CompanyNumber} /> 
                </div>

            </div>
            <br />
            <p>Page last updated: {formattedDate}</p>
        </main>

    );
}

/* 
 <div className=" border border-silver-200 p-10 rounded-lg flex flex-col h-full"><h1 className='f-heading-1'>Gazette Notices</h1></div>

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