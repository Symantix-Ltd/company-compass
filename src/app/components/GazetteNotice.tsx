'use client';

import React, { useEffect, useState } from 'react';
import noticeCodes from '@/data/notice-codes.json'; // adjust path if needed

interface GazetteNoticeProps {
  noticeNumber: string;
}

interface NoticeData {
  noticeId: string;
  status: string;
  noticeCode: number;
  publicationDate?: string;
  company?: {
    name: string;
    number: string;
    registeredOffice: string;
    principalTradingAddress?: string;
    natureOfBusiness?: string;
  };
  court?: {
    name: string;
    caseCode: string;
  };
  insolvencyPractitioner?: {
    idCode?: string; // Added for URLs
    name: string;
    firm: string;
    firmAddress: string;
  };
  edition?: string;
  articleHtml?: string;
}


function formatDateLong(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',  // Friday
    day: 'numeric',   // 12
    month: 'long',    // September
    year: 'numeric',  // 2025
  }).format(date);
}

export default function GazetteNotice({ noticeNumber }: GazetteNoticeProps) {
  const [noticeData, setNoticeData] = useState<NoticeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNotice() {
      try {
        const res = await fetch(`/api/gazette/notice?q=${noticeNumber}`);
        if (!res.ok) throw new Error('Failed to fetch notice JSON');

        const data: NoticeData = await res.json();
        setNoticeData(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      }
    }

    fetchNotice();
  }, [noticeNumber]);

  if (error) return <div className="text-red-600 font-bold p-4">Error loading notice: {error}</div>;
  if (!noticeData) return <div className="text-blue-600 font-semibold p-4">Loading notice {noticeNumber}…</div>;

  const noticeText = noticeCodes[noticeData.noticeCode] || '';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Corporate Insolvency Notice for ${noticeData.company?.name || noticeData.noticeId}`,
    "url": `https://www.thegazette.co.uk/id/notice/${noticeData.noticeId}`,
    "datePublished": noticeData.publicationDate || new Date().toISOString(),
    "publisher": {
      "@type": "Organization",
      "name": "The Gazette",
      "url": "https://www.thegazette.co.uk"
    },
    "mainEntityOfPage": {
      "@type": "Organization",
      "@id": `https://www.companycompass.co.uk/company/${noticeData.company?.number}`,
      "name": noticeData.company?.name
    },
    "about": {
      "@type": "Organization",
      "name": noticeData.company?.name,
      "identifier": noticeData.company?.number,
      "address": noticeData.company?.registeredOffice || ''
    },
    "mentions": [
      noticeData.court && noticeData.court.caseCode
        ? {
            "@type": "Event",
            "name": `Court Case ${noticeData.court.caseCode}`,
            "identifier": noticeData.court.caseCode,
            "location": {
              "@type": "Place",
              "name": noticeData.court.name || 'Unknown Court'
            },
            "description": `Court proceedings related to the insolvency of ${noticeData.company?.name}`
          }
        : null,
      noticeData.insolvencyPractitioner
        ? {
            "@type": "Person",
            "name": noticeData.insolvencyPractitioner.name,
            "affiliation": {
              "@type": "Organization",
              "name": noticeData.insolvencyPractitioner.firm,
              "address": noticeData.insolvencyPractitioner.firmAddress
            }
          }
        : null
    ].filter(Boolean),
    "articleBody": noticeData.articleHtml || ''
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-blue-50 rounded-lg shadow-md border border-blue-200">
      <header className="mb-4 border-b border-blue-300 pb-2">
        <h2 className="text font-bold text-blue-800 mb-1">Gazette Notice {noticeData.noticeId}</h2>
        <p><span className="font-semibold">{noticeText}</span></p>
        <p className="text-blue-600">
          Status: <span >{noticeData.status} </span> | {formatDateLong(noticeData.publicationDate)} 
        </p>
      </header>

      {noticeData.company && (
        <section className="mb-4 p-4 bg-blue-100 rounded-md border border-blue-200">
          <h3 className="text-xl font-semibold text-blue-700 mb-1">Company</h3>
          <p><span className="font-semibold">Name:</span> {noticeData.company.name}</p>
          <p><span className="font-semibold">Number:</span> {noticeData.company.number}</p>
          <p><span className="font-semibold">Registered Office:</span> {noticeData.company.registeredOffice}</p>
          {noticeData.company.principalTradingAddress && <p><span className="font-semibold">Principal Trading Address:</span> {noticeData.company.principalTradingAddress}</p>}
          {noticeData.company.natureOfBusiness && <p><span className="font-semibold">Nature of Business:</span> {noticeData.company.natureOfBusiness}</p>}
        </section>
      )}

      {noticeData.court && noticeData.court.caseCode && (
        <section className="mb-4 p-4 bg-blue-100 rounded-md border border-blue-200">
          <h3 className="text-xl font-semibold text-blue-700 mb-1">Court Case</h3>
          <p><span className="font-semibold">Court Name:</span> {noticeData.court.name || 'Unknown Court'}</p>
          <p><span className="font-semibold">Case Code:</span> {noticeData.court.caseCode}</p>
        </section>
      )}

      {noticeData.insolvencyPractitioner && (
        <section className="mb-4 p-4 bg-blue-100 rounded-md border border-blue-200">
          <h3 className="text-xl font-semibold text-blue-700 mb-1">Insolvency Practitioner</h3>
          <p><span className="font-semibold">Name:</span> {noticeData.insolvencyPractitioner.name}</p>
          <p><span className="font-semibold">Firm:</span> {noticeData.insolvencyPractitioner.firm}</p>
          <p><span className="font-semibold">Firm Address:</span> {noticeData.insolvencyPractitioner.firmAddress}</p>

          <p className="mt-2">
            <a
              className="bg-blue-500 hover:bg-blue-400 text-white font-semibold p-1 btn  mr-1 rounded border border-gray-700"
              href={`/explorer/insolvency-practitioner/${noticeData.insolvencyPractitioner.idCode || ''}`}
            >
              Insolvency Practitioner profile
            </a>
            <br/><br/>
            <a
              className="bg-blue-500 hover:bg-blue-400 text-white font-semibold btn p-1 mr-1 rounded border border-gray-700"
              href={`/search/person?q=${encodeURIComponent(noticeData.insolvencyPractitioner.name)}`}
            >
              Director search
            </a>
            {noticeData.insolvencyPractitioner.firm && (
              <>
                <br/><br/>
                <a
                  className="bg-blue-500 hover:bg-blue-400 text-white font-semibold btn p-1  mr-1 rounded border border-gray-700"
                  href={`/search?q=${encodeURIComponent(noticeData.insolvencyPractitioner.firm)}`}
                >
                  Company search
                </a>
              </>
            )}
          </p>
        </section>
      )}

      {noticeData.articleHtml && (
        <section className="mt-4 p-4 bg-white rounded-md border border-blue-200">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Full Notice</h3>
          <article dangerouslySetInnerHTML={{ __html: noticeData.articleHtml }} />
        </section>
      )}

      <p>
        <a className="hover:bg-blue-100 p-1 btn  mr-1 rounded border border-gray-700" target="_new" href={`https://www.thegazette.co.uk/notice/${noticeData.noticeId}`}>
          View original Gazette notice
        </a>
      </p>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
