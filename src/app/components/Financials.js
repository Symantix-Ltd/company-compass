"use client";

import { useEffect, useState } from "react";
import { formatGBP } from "@/lib/formatters";

export default function Financials({ companyNumber }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch API data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch(`/api/accounts?companyNumber=${companyNumber}`, { next: { revalidate: 86400 }});
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    if (companyNumber) {
      fetchData();
    }
  }, [companyNumber]);

  if (loading) return <p>Loading...</p>;
  if (!data || data.error) return <p>Error: {data?.error || "Unknown error"}</p>;

  return (
    <div>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 border-b border-gray-200 pb-1">
          Period Ended
        </h2>
        <p className="font-bold">{data.periodEnd}</p>
        <p>
          <span className="text-sm">
            For period{" "}
            <span className="font-bold">
              {data.periodStart} - {data.periodEnd}
            </span>
          </span>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 border-b border-gray-200 pb-1">
          Cash in Bank
        </h2>
        <p className="font-bold">{formatGBP(data.cash) ?? "Unreported"}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 border-b border-gray-200 pb-1">
          Total Assets
        </h2>
        <p className="font-bold">
          {formatGBP(data.totalAssets) ?? "Unreported"}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 border-b border-gray-200 pb-1">
          Total Liabilities
        </h2>
        <p className="font-bold">
          {formatGBP(data.totalLiabilities) ?? "Unreported"}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 border-b border-gray-200 pb-1">
          Net Assets
        </h2>
        <p className="font-bold">{formatGBP(data.netAssets) ?? "Unreported"}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 border-b border-gray-200 pb-1">
          Debt Ratio (%)
        </h2>
        <p className="font-bold">{data.debtRatio ?? "Unreported"}</p>
      </section>
    </div>
  );
}
