"use client";

import { useState } from "react";
import Link from "next/link";
import { BriefcaseIcon, CalendarIcon } from "@heroicons/react/24/outline";

export interface Appointment {
  appointed_to: {
    company_name: string;
    company_number: string;
    company_status: string;
  };
  appointed_on: string;
  resigned_on?: string;
  officer_role: string;
  occupation: string;
  address: {
    premises?: string;
    address_line_1?: string;
    locality?: string;
    region?: string;
    postal_code?: string;
    country?: string;
  };
}

interface AppointmentListProps {
  appointments: Appointment[];
  personName: string;
}

export default function AppointmentList({ appointments, personName }: AppointmentListProps) {
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  // Filter appointments based on active status
  const filtered = showActiveOnly
    ? appointments.filter((a) => a.appointed_to.company_status === "active")
    : appointments;

  function formatAddress(address: Appointment["address"]) {
    const parts = [
      address.premises,
      address.address_line_1,
      address.locality,
      address.region,
      address.country,
    ].filter(Boolean);

    return (
      <span>
        {parts.join(", ")}
        {address.postal_code && (
          <>
            {parts.length > 0 ? ", " : ""}
            <Link
              href={`/explorer/postcode/${encodeURIComponent(address.postal_code)}`}
              className="text-blue-600 hover:underline"
            >
              {address.postal_code}
            </Link>
          </>
        )}
      </span>
    );
  }

  // Group by company
  const companies = Array.from(
    filtered.reduce((map, item) => {
      if (!map.has(item.appointed_to.company_number)) {
        map.set(item.appointed_to.company_number, {
          company: item.appointed_to,
          appointments: [],
        });
      }
      map.get(item.appointed_to.company_number)!.appointments.push(item);
      return map;
    }, new Map<string, { company: Appointment["appointed_to"]; appointments: Appointment[] }>())
  ).map(([_, value]) => value);

  return (
    <div className="space-y-6">
      <form className="p-4 border rounded-md bg-gray-50 mb-4">
        <h2 className="text-lg font-semibold mb-2">Filter Appointments</h2>
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={(e) => setShowActiveOnly(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <span>Show current appointments only</span>
        </label>
      </form>

      {companies.map(({ company, appointments }) => (
        <div key={company.company_number}>
          {/* Company Ribbon */}
          <h3 className="inline-block bg-blue-500 text-white px-3 py-1 rounded-r-lg font-semibold mb-4">
            <Link href={`/company/${company.company_number}`}>
              {company.company_name}
            </Link>
          </h3>

          <div className="space-y-4 mt-2">
            {appointments.map((app, idx) => (
              <div key={idx} className="flex items-start space-x-4 border p-4 rounded-md shadow-sm hover:shadow-md transition">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  <BriefcaseIcon className="w-6 h-6 text-gray-500" />
                </div>
                {/* Content */}
                <div>
                  <div className="flex items-center text-gray-700 text-sm space-x-2 mb-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{app.appointed_on}</span>
                    {app.resigned_on && (
                      <>
                        <span className="mx-1">&ndash;</span>
                        <span>{app.resigned_on}</span>
                      </>
                    )}
                  </div>
                  <div className="text-gray-800">
                    <p>
                      <strong>{app.officer_role}:</strong> {personName}
                    </p>
                    <p>
                      <strong>Occupation:</strong> {app.occupation}
                    </p>
                    <p className="text-gray-500 text-sm">
                      <strong>Address:</strong> {formatAddress(app.address)}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      <Link
                        href={`/company/${app.appointed_to.company_number}`}
                        className="text-blue-600 hover:underline"
                      >
                        {app.appointed_to.company_name} ({app.appointed_to.company_number})
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
