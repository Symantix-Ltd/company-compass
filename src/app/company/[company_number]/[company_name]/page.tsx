
import { redirect } from 'next/navigation';


type Params = {
    company_number: string;
    company_name: string;
  };


export default async function CompanyNamePage({ params }: { params: Promise<Params> }) {

    const {company_number, company_name } = await params;

  redirect(`/company/${company_number}/${company_name}/companies-house-data`);
}
