// src/lib/dynamo.ts (or wherever you want this utility function)

export async function getRecordFromDynamoDB(company_number: string) {
  if (!company_number) {
    throw new Error('company number required');
  }

  const res = await fetch(
    `https://api.companieshouse.gov.uk/company/${company_number}`,
    {
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(process.env.CH_API_KEY + ':').toString('base64'),
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch company data from Companies House');
  }

  const companyData = await res.json();

  return companyData;
}
