
import { redirect } from 'next/navigation';

export default function CompanyNamePage({ params }: { params: { company_number: string, company_name:string } }) {
  redirect(`/company/${params.company_number}/${params.company_name}/companies-house-data`);
}
