import { redirect } from 'next/navigation';


type Params = {
    company_slug: string;
  };

export default async function Page({ params }: { params: Promise<Params> }) {

const {company_number, company_name} = await params;

  redirect(`/company/${company_number}/${company_name}/companies-house-data`);
}
