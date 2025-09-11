"use client";

import { useState } from "react";
import Link from "next/link";

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

  // ✅ Filter appointments based on resignation
  const filtered = showActiveOnly
  ? appointments.filter(
      (a) => !a.resigned_on && a.appointed_to.company_status.toLowerCase() === "active"
    )
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
      <>
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
      </>
    );
  }

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
    <div className="space-y-8">
      {/* Filter Toggle */}
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

      {/* Appointment Cards */}
      {companies.map(({ company, appointments }) => (
        <div
          key={company.company_number}
          className="border border-gray-300 p-6 bg-white rounded-md shadow-sm"
        >
          <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-6">
            <Link
              href={`/company/${company.company_number}`}
              className="text-blue-600 hover:underline"
            >
              {company.company_name} ({company.company_number})
            </Link>
          </h2>

          {appointments.map((app, idx) => (
            <div key={idx} className="space-y-6">
              {/* Grid Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-700">Company status</dt>
                  <dd className="text-gray-900">{company.company_status}</dd>
                </dl>
                <dl className="md:col-span-2">
                  <dt className="text-sm font-medium text-gray-700">Correspondence address</dt>
                  <dd className="text-gray-900">{formatAddress(app.address)}</dd>
                </dl>
              </div>

              {/* Grid Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Role
                    {app.resigned_on && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                        Resigned
                      </span>
                    )}
                  </dt>
                  <dd className="text-gray-900">{app.officer_role}</dd>
                </dl>
                <dl>
                  <dt className="text-sm font-medium text-gray-700">Appointed on</dt>
                  <dd className="text-gray-900">{formatDate(app.appointed_on)}</dd>
                </dl>
                {app.resigned_on && (
                  <dl>
                    <dt className="text-sm font-medium text-gray-700">Resigned on</dt>
                    <dd className="text-gray-900">{formatDate(app.resigned_on)}</dd>
                  </dl>
                )}
              </div>

              {/* Grid Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-700">Nationality</dt>
                  <dd className="text-gray-900">British</dd>
                </dl>
                <dl>
                  <dt className="text-sm font-medium text-gray-700">Country of residence</dt>
                  <dd className="text-gray-900">{app.address.country || "N/A"}</dd>
                </dl>
                <dl>
                  <dt className="text-sm font-medium text-gray-700">Occupation</dt>
                  <dd className="text-gray-900">{app.occupation || "N/A"}</dd>
                </dl>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
