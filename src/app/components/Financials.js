"use client";

export const revalidate = 86400;

import { useEffect, useState } from "react";
import { formatGBP } from "@/lib/formatters";
import Script from "next/script";

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

  // Initialize chart when data & Chart.js are ready
  useEffect(() => {
    if (!data || typeof window.Chart === "undefined") return;

    const ctx = document.getElementById("fin_graph_div");
    if (!ctx) return;

    new window.Chart(ctx, {
      type: "line",
      data: {
        labels: data.years ?? [
          "2015",
          "2016",
          "2017",
          "2018",
          "2019",
          "2020",
          "2021",
          "2022",
          "2023",
          "2024",
        ],
        datasets: [
          {
            label: "Net Assets",
            data: data.netAssetsHistory ?? [
              591990, 449994, 405070, 317602, 536181, 927009, 994374, 941403,
              1018868, 949171,
            ],
            backgroundColor: ["rgba(1, 87, 155, 0.5)"],
            borderColor: "#01579b",
            pointBackgroundColor: "#01579b",
            pointBorderColor: "#01579b",
          },
          {
            label: "Total Assets",
            data: data.totalAssetsHistory ?? [
              666453, 535518, 472589, 406645, 1014541, 1059812, 1170802,
              1178721, 1325432, 1405687,
            ],
            backgroundColor: ["rgba(77, 182, 172,0.5)"],
            borderColor: "#4db6ac",
            pointBackgroundColor: "#4db6ac",
            pointBorderColor: "#4db6ac",
          },
          {
            label: "Total Liabilities",
            data: data.totalLiabilitiesHistory ?? [
              -74463, -85524, -67519, -89043, -478360, -132803, -176428,
              -237318, -306564, -456516,
            ],
            backgroundColor: ["rgba(176, 190, 197, 0.5)"],
            borderColor: "#b0bec5",
            pointBackgroundColor: "#b0bec5",
            pointBorderColor: "#b0bec5",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: { point: { radius: 0.5 }, line: { borderWidth: 1, tension: 0.5 } },
        legend: { display: false },
        scales: {
          xAxes: [
            {
              ticks: { fontColor: "#9e9e9a", fontSize: 11, padding: 5 },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontColor: "#9e9e9a",
                fontSize: 11,
                padding: 5,
                callback: function (label) {
                  return label.toLocaleString();
                },
              },
            },
          ],
        },
      },
    });
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (!data || data.error) return <p>Error: {data?.error || "Unknown error"}</p>;

  return (
    <div>
      {/* Load Chart.js from CDN */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js"
        strategy="afterInteractive"
      />

      <div className="financial-graph">
        <div>Net Assets, Total Assets &amp; Total Liabilities (2015–2024)</div>
        <div style={{ height: 200 }}>
          <canvas
            id="fin_graph_div"
            
            className="chartjs-render-monitor"
          ></canvas>
        </div>
      </div>

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
