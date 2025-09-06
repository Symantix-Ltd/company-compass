// app/components/OfficersSchema.js
import React from 'react';


export default function OfficersSchema({ data }) {
  if (!data?.items || data.items.length === 0) return null;

  // Map each officer to a schema.org Person object
  const persons = data.items.map((item) => {
    const birthDate = item.date_of_birth
      ? `${item.date_of_birth.year}-${String(item.date_of_birth.month).padStart(2, '0')}-01`
      : undefined;

    // Format address if available
    const address = item.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: [item.address.premises, item.address.address_line_1, item.address.address_line_2]
            .filter(Boolean)
            .join(', '),
          addressLocality: item.address.locality,
          addressRegion: item.address.region,
          postalCode: item.address.postal_code,
          addressCountry: item.address.country,
        }
      : undefined;

    // Role information
    const role = {
      '@type': 'Role',
      roleName: item.officer_role,
      startDate: item.appointed_on,
      endDate: item.resigned_on || undefined,
      occupationalCategory: item.occupation || undefined,
    };

    return {
      '@type': 'Person',
      name: item.name,
      birthDate,
      nationality: item.nationality,
      address,
      hasOccupation: role,
    };
  });

  const schema = {
    '@context': 'https://schema.org',
    '@graph': persons,
  };

  return (
    
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
      />
    
  );
}
