//https://api.company-information.service.gov.uk/advanced-search/companies?sic_codes=62012

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // This disables caching for this route

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const apiKey = process.env.CH_API_KEY;
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
  }

  
  if (!apiKey) {
    return NextResponse.json({ error: "API key not set" }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://api.company-information.service.gov.uk/advanced-search/companies?sic_codes=${encodeURIComponent(q)}`,
      {
        headers: {
          Authorization: "Basic " + Buffer.from(apiKey + ":").toString("base64"),
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Companies House API error" }, { status: response.status });
    }

    const data = await response.json();

    

    return NextResponse.json(data.items || []);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
