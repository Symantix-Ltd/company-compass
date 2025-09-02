// app/company/[company_number]/page.tsx

import { redirect } from 'next/navigation';



function slugify(title: string) {
    return title
      .toLowerCase()
      .replace(/\./g, '') 
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }


  type Params = {
    company_number: string;
   
  };


export default async function CompanyNamePage({ params }: { params: Promise<Params> }) {

    const {company_number} = await params;
    const apiKey = process.env.CH_API_KEY;
 

  const response = await fetch(`https://api.company-information.service.gov.uk/company/${company_number}`, {
    headers: {
      'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`
    },
    next: { revalidate: 86400 } // cache for 1 day
  });

  if (!response.ok) {
    // You can show a custom 404 or throw an error
    redirect('/not-found'); // or return <NotFound /> if you want JSX
  }

  const data = await response.json();
  const company_name = encodeURIComponent(slugify(data.company_name) || '');

  redirect(`/company/${company_number}/${company_name}/companies-house-data`);
}
