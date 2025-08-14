


"use client";
import React from "react";

/*
const LongDate: React.FC<LongDateProps> = ({ date }) => {
    const dateObj = new Date(date);

    const longDate = dateObj.toLocaleDateString("en-UK", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return longDate;
};
*/

const MonthsSince = ({ date }) => {
    const startDate = new Date(date);
    const today = new Date();
  
    const months =
      (today.getFullYear() - startDate.getFullYear()) * 12 +
      (today.getMonth() - startDate.getMonth());
  
    return <>{months < 0 ? 0 : months}</>;
  };
  
  export {MonthsSince};
  

const LongDate = ({ date }) => {
    const dateObj = new Date(date);
  
    const longDate = dateObj.toLocaleDateString("en-UK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  
    return <>{longDate}</>;
  };
  
  export { LongDate};

const MonthsUntil = ({ date }) => {
    const targetDate = new Date(date);
    const today = new Date();
  
    const months =
      (targetDate.getFullYear() - today.getFullYear()) * 12 +
      (targetDate.getMonth() - today.getMonth());
  
    return <>{months < 0 ? 0 : months}</>;
  };
  
  export {MonthsUntil};
  
  

const YearsSince = (date) => {
    const startDate = new Date(date);
    const today = new Date();
  
    return (
      today.getFullYear() -
      startDate.getFullYear() -
      (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0)
    );
  };
  
  export { YearsSince };
  

const parseDate = (dateStr) => {
    if (dateStr.includes("/")) {
      // Parse as DD/MM/YYYY
      return parseDMY(dateStr);
    }
    // Otherwise, try direct parsing (ISO or other formats)
    return new Date(dateStr);
  };
  
  export { parseDate };
  

const parseDMY = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };
  
  export { parseDMY};

  
export default function Summary({ data }) {
  
  if (!data) return null;



  return (
<div>
                    
{/* Company Name */}
<h1 className="f-heading-2  text-blue-500">{data.CompanyName}</h1>
<br />
{/* Intro paragraph */}
<p className="text-lg text-gray-700 mb-8 leading-relaxed">
    {data.CompanyName} is a <span className="font-semibold">{data.CompanyCategory}</span> company incorporated on{" "}
    <LongDate date={data.IncorporationDate} /> with the registered office in{" "}
    <span className="font-medium">{data.RegAddress_AddressLine2} {data.RegAddress_PostTown}</span>.
</p>

<br />


{/* Status */}
<section className="mb-8">
    <h2 className="text-2xl font-semibold mb-2 text-gray-900 border-b border-gray-200 pb-1">Status</h2>
    <p className="text-lg text-blue-500 font-bold">{data.CompanyStatus}</p>
</section>
<br />
{/* Company Number */}
<section className="mb-8">
    <h2 className="text-2xl font-semibold mb-2 text-gray-900 border-b border-gray-200 pb-1">Company Number</h2>
    <p className="text-lg text-gray-700  font-bold">{data.CompanyNumber}</p>
    <p className="text-gray-600 italic mt-1">{data.CompanyCategory}</p>
</section>
<br />
{/* Age */}
<section className="mb-8">
    <h2 className="text-2xl font-semibold mb-2 text-gray-900 border-b border-gray-200 pb-1">Age</h2>
    <p className="text-lg text-gray-700 font-bold">
        <YearsSince date={data.IncorporationDate} /> years
    </p>
    <p className="text-gray-600 italic ">
        Incorporated <LongDate date={data.IncorporationDate} />
    </p>
</section>

{/* Size 
<section className="mb-8">
<h2 className="text-2xl font-semibold mb-2 text-gray-900 border-b border-gray-200 pb-1">Size</h2>
<p className="text-lg  mb-2 text-blue-500">{data.Accounts_AccountCategory}</p>
<ul className="list-disc list-inside text-gray-600">
<li>Reason e.g. turnover is under £1m</li>
</ul>
</section>
*/}
{/* Confirmation */}
<section className="mb-8">
    <h2 className="text-2xl font-semibold mb-2 text-gray-900 border-b border-gray-200 pb-1">Confirmation</h2>
    <p className="text-lg text-gray-700 mb-2 font-bold">
        Dated <LongDate date={data.ConfStmtLastMadeUpDate} /> (<MonthsSince date={data.ConfStmtLastMadeUpDate} /> months ago)
    </p>
    <ul className="list-disc list-inside text-gray-600">
        <li>Next confirmation due date <LongDate date={data.ConfStmtNextDueDate} /></li>
        <li>(<MonthsUntil date={data.ConfStmtNextDueDate} /> months remaining)</li>
    </ul>
</section>

{/* Accounts */}
<section className="mb-8">
    <h2 className="text-2xl font-semibold mb-2 text-gray-900 border-b border-gray-200 pb-1">Accounts</h2>

    <ul className="list-disc list-inside text-gray-600">
        <li>Last accounts made up to <LongDate date={parseDate(data.Accounts_LastMadeUpDate)} /></li>
        <li>Accounts type is <span className="text-blue-500 font-bold">{data.Accounts_AccountCategory}</span></li>

        <li className="font-bold">Next accounts due date <LongDate date={parseDate(data.Accounts_NextDueDate)} /></li>
    </ul>
</section>


{/* Nature of Business */}
<section>
    <h2 className="text-2xl font-semibold mb-2 text-gray-900 border-b border-gray-200 pb-1">Nature of Business (SIC)</h2>
    <p className="text-lg text-gray-700 font-bold">{data.SICCode_SicText_1}</p>
</section>

</div>

  )};