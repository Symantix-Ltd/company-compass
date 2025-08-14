"use client"; // marks this file as a Client Component

import dynamic from "next/dynamic";

// Dynamically import FinancialChart with no SSR
const FinancialChart = dynamic(() => import("./FinancialChart"), { ssr: false });

export default function FinancialChartWrapper(props) {
  return <FinancialChart {...props} />;
}
