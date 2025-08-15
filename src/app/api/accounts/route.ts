import { NextRequest, NextResponse } from 'next/server';

import * as cheerio from 'cheerio';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const companyNumber = searchParams.get('companyNumber');
  const apiKey = process.env.CH_API_KEY;

  if (!companyNumber) {
    return NextResponse.json({ error: 'Missing companyNumber' }, { status: 400 });
  }

  try {
    // Step 1: Filing history
    const filingHistoryRes = await fetch(
      `https://api.companieshouse.gov.uk/company/${companyNumber}/filing-history?category=accounts`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
        },
        next: { revalidate: 86400 },
      }
    );

    const filingHistory = await filingHistoryRes.json();
    if (!filingHistory.items?.length) {
      return NextResponse.json({ error: 'No accounts found' }, { status: 404 });
    }

    // Step 2: Latest XBRL (iXBRL HTML)
    const latestFiling = filingHistory.items[0];
    const docId = latestFiling.transaction_id;

    const xbrlRes = await fetch(
      `https://find-and-update.company-information.service.gov.uk/company/${companyNumber}/filing-history/${docId}/document?format=xhtml&download=0`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
        },  next: { revalidate: 86400 }
      }
    );

    const xbrlHtml = await xbrlRes.text();

    // Step 3: Parse with Cheerio
    const $ = cheerio.load(xbrlHtml);

    // Helper: get numeric fact by XBRL name
    const getFact = (name: string, context?: string) => {
      const selector = `ix\\:nonFraction[name="${name}"]${context ? `[contextRef="${context}"]` : ''}`;
      const val = $(selector).first().text().trim();
      return val ? parseFloat(val.replace(/,/g, '')) : null;
    };

    // Extract values
    const cash = getFact('frs-core:CashBankOnHand', 'CURRENT_FY_END')
      ?? getFact('uk-gaap:CashAndCashEquivalentsAtCarryingValue', 'CURRENT_FY_END');

    // Helper to parse money values (remove commas, parentheses, convert to number)
  function parseMoney(text:string) {
    if (!text) return 0;
    text = text.trim();
    let negative = false;
    if (text.startsWith('(') && text.endsWith(')')) {
      negative = true;
      text = text.slice(1, -1);
    }
    text = text.replace(/,/g, '');
    const val = parseFloat(text);
    return negative ? -val : val;
  }

  const periodStart = $('ix\\:nonNumeric[contextRef="CURRENT_FY_START"][name="frs-bus:StartDateForPeriodCoveredByReport"]').text().trim();
  const periodEnd = $('ix\\:nonNumeric[contextRef="CURRENT_FY_END"][name="frs-bus:EndDateForPeriodCoveredByReport"]').text().trim();


  // Extract Fixed Assets (CURRENT_FY_END)
  const fixedAssetsText = $('td.money[title="FixedAssetsTotal"] ix\\:nonFraction[contextRef="CURRENT_FY_END"]').first().text();
  const fixedAssets = parseMoney(fixedAssetsText);

  // Extract Current Assets (CURRENT_FY_END)
  const currentAssetsText = $('td.money[title="Current_Total"] ix\\:nonFraction[contextRef="CURRENT_FY_END"]').first().text();
  const currentAssets = parseMoney(currentAssetsText);

  // Extract Creditors: Amounts Falling Due Within One Year (CURRENT_FY_END)
  const creditorsText = $('td.money[title^="Creditors_"] ix\\:nonFraction[contextRef="CURRENT_FY_END"]').first().parent().text();
  const creditors = parseMoney(creditorsText);

  // Extract Net Assets (CURRENT_FY_END)
  const netAssetsText = $('td.money[title="Net_Assets"] ix\\:nonFraction[contextRef="CURRENT_FY_END"]').first().text();
  const netAssets = parseMoney(netAssetsText);

  // Extract Deferred Taxation (CURRENT_FY_END)
  const deferredTaxText = $('td.money[title="Provisions_DeferredT_credit"] ix\\:nonFraction[contextRef="CURRENT_FY_END"]').first().parent().text();
  const deferredTax = parseMoney(deferredTaxText);

  // Calculate total assets and total liabilities
  const totalAssets = fixedAssets + currentAssets;
  //const totalLiabilities = creditors + deferredTax;

  // Calculate debt ratio
  const totalLiabilities = Math.abs(creditors) + Math.abs(deferredTax);
  //const debtRatio = totalAssets && totalLiabilities
    //  ? ((totalLiabilities / totalAssets) * 100).toFixed(0)
   //   : null;

      
    const debtRatio = totalAssets && totalLiabilities ? Math.round((totalLiabilities / totalAssets) * 100) : null;
      

    return NextResponse.json({
      periodStart,
      periodEnd,
      cash,
      totalAssets,
      totalLiabilities,
      netAssets,
      debtRatio,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch accounts data' }, { status: 500 });
  }
}