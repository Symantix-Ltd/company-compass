// app/components/PersonSchema.js
'use client';

import React from 'react';
import Head from 'next/head';

export default function PersonSchema({ personData }) {
  const { name, date_of_birth, nationality, items } = personData;

  const birthDate = date_of_birth
    ? `${date_of_birth.year}-${String(date_of_birth.month).padStart(2, '0')}-01`
    : undefined;

  // Map appointments to schema.org "hasOccupation"
  const occupations = items.map((item) => ({
    '@type': 'Role',
    roleName: item.officer_role,
    startDate: item.appointed_on,
    occupationalCategory: item.occupation,
    name: item.appointed_to?.name || undefined,
    address: item.address || undefined,
    countryOfResidence: item.country_of_residence,
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name,
    birthDate: birthDate,
    nationality: nationality,
    hasOccupation: occupations,
  };

  return (
    
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
      />
    
  );
}
