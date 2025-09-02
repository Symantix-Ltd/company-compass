
import { redirect } from 'next/navigation';


type Params = {
    company_slug: string;
  };

export default async function CompanyNamePage({ params }: { params: Promise<Params> }) {

const {company_slug} = await params;
const [company_number, ...rest] = company_slug.split('-');
const company_name = rest.join('-');


  redirect(`/company/${company_number}/${company_name}/companies-house-data`);
}
