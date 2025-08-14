// components/OfficerItem.js
import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function OfficerItem({ officer }) {
  const roles = officer.officer_role ? officer.officer_role.split(" • ").join(" • ") : "";
  const nationality = officer.nationality || "";
  const residence = officer.country_of_residence || "";
  const appointed_on = officer.appointed_on ? `Appointed on ${officer.appointed_on}` : "";
  const resigned_on = officer.resigned_on ? `Resigned on ${officer.resigned_on}.` : "Active";

  return (
    <div className="grid grid-cols-[min-content_auto] gap-x-4 gap-y-2">
      <div className="whitespace-nowrap">
        <UserCircleIcon className="size-6 text-blue-500" />
      </div>
      <div className="text-left">
        <strong>{officer.name}</strong>
        <br />
        <span>
          {roles} • {nationality} • {residence}
        </span>
        <br />
        {officer.former_names && officer.former_names.length > 0 && (
          <em>
            Former names:{" "}
            {officer.former_names
              .map(name => `${name.forenames} ${name.surname}`)
              .join(", ")}
          </em>
        )}
        <br />
        <span>
          {appointed_on} {resigned_on}
        </span>
      </div>
    </div>
  );
}
