"use client";
import React from "react";
import { LongDate, MonthsSince, MonthsUntil, YearsSince, parseDate } from "./utils"; // import your helpers

export default function Summary({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-10 p-6 max-w-5xl mx-auto">

      {/* Intro */}
      <p className="text-lg text-gray-700 leading-relaxed">
        <span className="font-semibold">{data.company_name}</span> is a{" "}
        <span className="font-semibold">{data.CompanyCategory}</span> company, incorporated on{" "}
        <LongDate date={data.date_of_creation} /> with its registered office in{" "}
        <span className="font-medium">{data.registered_office_address.address_line_1}, {data.registered_office_address.locality}</span>.
      </p>

      {/* Grid for key metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Company Name */}
        <div className="bg-white shadow-sm p-5 rounded-md border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">Company Name</h3>
          <p className="text-lg font-bold">{data.company_name}</p>
        </div>

        {/* Company Type */}
        <div className="bg-white shadow-sm p-5 rounded-md border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">Company Type</h3>
          <p className="text-gray-700 font-bold">{data.CompanyCategory}</p>
        </div>

        {/* Status */}
        <div className="bg-white shadow-sm p-5 rounded-md border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">Status</h3>
          <p className="text-blue-500 font-bold">{data.company_status}</p>
        </div>

        {/* Age */}
        <div className="bg-white shadow-sm p-5 rounded-md border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">Age</h3>
          <p className="text-lg text-gray-700 font-bold">
            <YearsSince date={data.date_of_creation} /> years
          </p>
          <p className="text-gray-500 italic">
            Incorporated <LongDate date={data.date_of_creation} />
          </p>
        </div>

        {/* Confirmation */}
        <div className="bg-white shadow-sm p-5 rounded-md border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">Confirmation</h3>
          <p className="text-gray-700 font-bold mb-2">
            Last made up on <LongDate date={data.confirmation_statement.last_made_up_to} /> (<MonthsSince date={data.confirmation_statement.last_made_up_to} /> months ago)
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>Next confirmation due: <LongDate date={data.confirmation_statement.next_due} /></li>
            <li>(<MonthsUntil date={data.confirmation_statement.next_due} /> months remaining)</li>
          </ul>
        </div>

        {/* Accounts */}
        <div className="bg-white shadow-sm p-5 rounded-md border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">Accounts</h3>
          <ul className="list-disc list-inside text-gray-600">
            {data.accounts.last_accounts && (
              <li>Last made up to <LongDate date={parseDate(data.accounts.last_accounts.made_up_to)} /></li>
            )}
            <li>Accounts type: <span className="text-blue-500 font-bold">{data.accounts.last_accounts.type}</span></li>
            <li className="font-bold">Next accounts due: <LongDate date={parseDate(data.accounts.next_accounts.due_on)} /></li>
          </ul>
        </div>

        {/* SIC / Nature of Business */}
        <div className="bg-white shadow-sm p-5 rounded-md border border-gray-200 col-span-1 md:col-span-2 lg:col-span-3">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">Nature of Business (SIC)</h3>
          <p className="text-lg text-gray-700 font-bold">{data.sic_codes}</p>
        </div>

      </div>
    </div>
  );
}
