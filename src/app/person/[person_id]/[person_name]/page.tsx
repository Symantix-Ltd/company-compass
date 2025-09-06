import AppointmentList from "../../../components/AppointmentList";
import AdSlot from '../../../components/AdSlot';

import PersonSchema from '../../../components/PersonSchema';


interface Appointment {
  appointed_to: {
    company_name: string;
    company_number: string;
    company_status: string;
  };
  appointed_on: string;
  resigned_on?: string;
  officer_role: string;
  occupation: string;
  address: {
    premises?: string;
    address_line_1?: string;
    locality?: string;
    region?: string;
    postal_code?: string;
    country?: string;
  };
}

interface PersonData {
  name: string;
  date_of_birth?: {
    month?: number;
    year?: number;
  };
  items: Appointment[];
  active_count: number;
  resigned_count: number;
  inactive_count: number;
}



// Fetch data from Companies House API
async function getPersonData(person_id: string): Promise<PersonData | null> {
  const apiKey = process.env.CH_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://api.company-information.service.gov.uk/officers/${person_id}/appointments`,
      {
        headers: {
          Authorization: "Basic " + Buffer.from(apiKey + ":").toString("base64"),
        },
        cache: "force-cache",
      }
    );

    
    if (!res.ok) return null;
   
    return res.json();
  } catch {
    return null;
  }
}

interface Params {
    person_id: string;
    person_name: string;
  };


export default async function PersonPage({ params }: { params: Promise<Params> }) {

    const { person_id, person_name } = await params;


  const data = await getPersonData(person_id);

  if (!data) return <p className="p-4">No data found.</p>;

 
  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
        <main className="max-w-4xl mx-auto p-6 bg-white rounded-lg text-gray-900">
          <h1 className="text-3xl font-bold py-5">Person Profile | {data?.name} </h1>
          <p>
            Information source:{" "}
            <a
              target="_new"
              href={`https://find-and-update.company-information.service.gov.uk/officers/${person_id}/appointments`}
              className="text-blue-600 hover:underline"
            >
              Companies House UK
            </a>
          </p>
          <br/>
          <p className="mb-2">
            <strong>Date of Birth:</strong>{" "}
            {data.date_of_birth?.month}/{data.date_of_birth?.year || ""}
          </p>
          <p className="mb-6">
            <strong>Total Active:</strong> {data.active_count} &nbsp;|&nbsp; 
            <strong>Resigned:</strong> {data.resigned_count} &nbsp;|&nbsp; 
            <strong>Inactive:</strong> {data.inactive_count}
          </p>

          <AppointmentList appointments={data.items} personName={data.name} />

          <PersonSchema personData={data} />
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
