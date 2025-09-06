// app/components/CompanySchema.js
import React from 'react';
import Head from 'next/head';

export default function CompanySchema({ companyData }) {
  if (!companyData) return null;

  const {
    CompanyName,
    CompanyNumber,
    CompanyStatus,
    IncorporationDate,
    URI,
    RegAddress_AddressLine1,
    RegAddress_AddressLine2,
    RegAddress_PostTown,
    RegAddress_County,
    RegAddress_PostCode,
    RegAddress_Country,
    SICCode_SicText_1,
    SICCode_SicText_2,
    Accounts_AccountCategory,
    Accounts_AccountRefDay,
    Accounts_AccountRefMonth,
    Accounts_LastMadeUpDate,
    Accounts_NextDueDate,
  } = companyData;

  const url = "https://www.companycompass.co.uk/company/" + CompanyNumber;

  const address = {
    '@type': 'PostalAddress',
    streetAddress: [RegAddress_AddressLine1, RegAddress_AddressLine2].filter(Boolean).join(', '),
    addressLocality: RegAddress_PostTown,
    addressRegion: RegAddress_County,
    postalCode: RegAddress_PostCode,
    addressCountry: RegAddress_Country,
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': url || undefined,
    name: CompanyName,
    legalName: CompanyName,
    identifier: CompanyNumber,
    foundingDate: IncorporationDate,
    address,
    url: url,
    status: CompanyStatus,
    knowsAbout: [SICCode_SicText_1, SICCode_SicText_2].filter(Boolean),
    accounting: {
      '@type': 'Organization',
      name: 'Accounts',
      accountingCategory: Accounts_AccountCategory,
      accountingReferenceDate: `${Accounts_AccountRefDay}/${Accounts_AccountRefMonth}`,
      lastAccountsDate: Accounts_LastMadeUpDate,
      nextAccountsDueDate: Accounts_NextDueDate,
    },
  };

  return (
    
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
      />
    
  );
}
