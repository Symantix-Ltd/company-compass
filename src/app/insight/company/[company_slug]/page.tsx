
import { redirect } from 'next/navigation';

export default function CompanyNamePage({ params }: { params: { company_slug: string,  } }) {


const [company_number, ...rest] = params.company_slug.split('-');
const company_name = rest.join('-');


  redirect(`/company/${company_number}/${company_name}/companies-house-data`);
}
