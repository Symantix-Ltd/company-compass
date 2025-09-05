// components/OfficerItem.js
import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";






function slugify(title) {
  return title
    .toLowerCase()
    .replace(/,/g, '') 
    .trim() 
    .replace(/\./g, '') 
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function OfficerItem({ officer }) {

  
  console.log(officer);
  const roles = officer.officer_role.charAt(0).toUpperCase() + officer.officer_role.slice(1) || "";
  const nationality = officer.nationality || "";
  const residence = officer.country_of_residence || "";
  const appointedOn = officer.appointed_on ? officer.appointed_on : "";
  const resignedOn = officer.resigned_on ? `Resigned on: ${officer.resigned_on}` : "Active";
  const pre1992 = officer.is_pre_1992_appointment ? "Yes" : "No";
  const dob = officer.date_of_birth
    ? `${officer.date_of_birth.month ? officer.date_of_birth.month + "/" : ""}${officer.date_of_birth.year}`
    : "N/A";
  const companyHouseLink = `https://find-and-update.company-information.service.gov.uk${officer.links?.officer?.appointments || ""}`;
  const personPageLink = `/person/${officer.links?.officer.appointments.match(/\/officers\/([^\/]+)\//)[1]}/${slugify(officer.name)}`;

  return (
    <div className="grid grid-cols-[min-content_auto] gap-x-4 gap-y-2  bg-blue-100 rounded p-5 pb-4 mb-4">
      <div className="whitespace-nowrap">
        <UserCircleIcon className="h-10 w-10 text-blue-500" />
      </div>
      <div className="text-left space-y-1">
        <strong className="text-lg underline text-blue-500"><a href={personPageLink}>{officer.name}</a></strong>
        <div className="text-sm text-gray-600">
          {roles} • {nationality} • {residence}
        </div>

        {officer.former_names && officer.former_names.length > 0 && (
          <div className="text-sm italic">
            <span className="font-bold">Former names:</span> {officer.former_names.map(name => `${name.forenames} ${name.surname}`).join(", ")}
          </div>
        )}

        <div className="text-sm">
        <span className='font-bold'>Appointed on:</span> {appointedOn} •  {resignedOn} 
        </div>

        <div className="text-sm">
        <span className="font-bold">Date of Birth:</span> {dob}
        </div>

        {officer.address && (
          <div className="text-sm">
            <span className="font-bold">Address:</span> {officer.address.premises}, {officer.address.address_line_1}, {officer.address.locality}, {officer.address.postal_code}
          </div>
        )}

        <div className="text-sm space-x-2 mt-1 py-5 g-5">
          <Link href={companyHouseLink} target="_blank" className=" italic">
            Source: Companies House
          </Link>
          
        </div>
      </div>
    </div>
  );
}
