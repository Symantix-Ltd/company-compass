import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { companyNumber, companyName } = await req.json();

    if (!companyNumber || !companyName) {
      return NextResponse.json(
        { error: 'Both company number and company name are required' },
        { status: 400 }
      );
    }

    // Fetch official company data from Companies House API
    const res = await fetch(
      `https://api.companieshouse.gov.uk/company/${companyNumber}`,
      {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(process.env.CH_API_KEY + ':').toString('base64'),
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch company data from Companies House' },
        { status: 400 }
      );
    }

    const companyData = await res.json();

    // Prepare prompt for GPT-4-turbo
    const prompt = `
      Summarize the UK company "${companyName}" based on the official Companies House data below.
      Include business type, industry, date of incorporation, status, and key details.

      Companies House Data:
      ${JSON.stringify(companyData, null, 2)}

      Also include any recent news references and Gazette notices
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an assistant that summarizes UK companies accurately based on official data.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
    });

    const summary = completion.choices[0]?.message?.content || 'No summary available.';

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
