
import { redirect } from 'next/navigation';


type Params = {
    company_slug: string;
  };

export default async function CompanyNamePage({ params }: { params: Promise<Params> }) {

const {company_slug} = await params;
const [company_number] = company_slug.split('-')[0];


  redirect(`/company/${company_number}`);
}
