
import { redirect } from 'next/navigation';

export default function CompanyNamePage({ params }: { params: { company_number: string;  } }) {
  redirect(`/company/${params.company_number}//companies-house-data`);
}



