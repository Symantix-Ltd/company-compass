'use client';

import React from 'react';
import Link from 'next/link';

import ShareButtons from './ShareButtons';

export function YearsSince(dateInput) {
    if (!dateInput) return null; // handle null/undefined
  
    const dateStr = typeof dateInput === 'string' ? dateInput : dateInput.date;
    if (!dateStr) return null;
  
    const parts = dateStr.split('-').map(Number);
    if (parts.length !== 3) return null; // invalid format
  
    const startDate = new Date(parts[0], parts[1] - 1, parts[2]);
    if (isNaN(startDate)) return null;
  
    const today = new Date();
    let years = today.getFullYear() - startDate.getFullYear();
  
    if (
      today.getMonth() < startDate.getMonth() ||
      (today.getMonth() === startDate.getMonth() && today.getDate() < startDate.getDate())
    ) {
      years--;
    }
  
    return years;
  }
  

  function slugify(name) {
    return name
      .toLowerCase()
      .replace(/\./g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  export default function CompanyHeader({ company }) {
    if (!company) return null; // safety check
  
    // Map data from company object
    const name = company.CompanyName;
    const companyNumber = company.CompanyNumber;
    const status = company.CompanyStatus;
    const age = company.incorporationDate; // or calculate years if needed
    const directors = company.DirectorsCount; // optional if available
    const address = {
      street: company.RegAddress_AddressLine1,
      region: company.RegAddress_PostTown ,
      postalCode: company.RegAddress_PostCode,
    };
    const country = company.RegAddress_Country;

    const companyNameSlug = slugify(name);
    
    //  {country && <img src={'/img/' + country.toLowerCase() + '.png'} alt={country + ' Country Flag'} className="w-5 h-5 mt-1 border" />}
       
    const companyUrl = "https://www.companycompass.co.uk/company/" + companyNumber + "/" + companyNameSlug;

  return (
    <div className="border rounded shadow-md p-6 md:flex md:justify-between md:items-start space-y-4 md:space-y-0 bg-silver">
     
      {/* Left Section */}
      <div className="md:flex-1">
        <h1 className="font-bold ">{name}</h1>

        {/* Address */}
        <p className="text-gray-700 mb-4 flex items-start gap-2">
          <span>
            {address.street} <br />
            {address.region} <br />
            <a className="underline" href={`/explorer/postcode?q=${address.postalCode}`}>{address.postalCode}</a>
          </span>
        </p>

        <hr className="border-t border-gray-300 my-4" />

        {/* Company Info */}
        <ul className="flex flex-wrap gap-4 text-gray-700">
          {status && (
            <li>
              <div className=" text-blue-500 font-bold ">
                {status}
              </div>
            </li>
          )}
          {age && (
            <li>
              <Link
                href={`./companies-house-data`}
                className="hover:underline"
              >
                Age: <span className="font-semibold"><YearsSince date={age}/></span>
              </Link>
            </li>
          )}
          {directors !== undefined && (
            <li>
              <Link
                href={`./companies-house-data#directors-and-secretaries`}
                className="hover:underline"
              >
                Directors: <span className="font-semibold">{directors}</span>
              </Link>
            </li>
          )}
          {companyNumber && (
            <li>
              <Link
                href={`./companies-house-data`}
                className="hover:underline"
              >
                Company No: <span className="font-semibold">{companyNumber}</span>
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Right Section */}
      <div className="flex flex-col gap-2 md:ml-6">
        <a
          href="/subscription"
          className="border border-blue-600 bg-blue-400 text-white px-4 py-2 rounded text-center hover:bg-blue-300 transition"
        >
          Buy report
        </a>
        <Link
          href="/login"
          className="border border-blue-600  px-4 py-2 rounded text-center hover:bg-blue-200 transition"
        >
          Log In to watch
        </Link>
        <ShareButtons companyName={name} companyUrl={companyUrl} />
      </div>
     
  
    </div>
  );
}
