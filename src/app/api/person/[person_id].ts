// pages/api/person/[person_id].ts
import type { NextApiRequest, NextApiResponse } from 'next'

const COMPANIES_HOUSE_API_BASE = 'https://api.company-information.service.gov.uk'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { person_id } = req.query

  const apiKey = process.env.CH_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Companies House API key' })
  }

  try {

    url = `${COMPANIES_HOUSE_API_BASE}/officers/${person_id}/appointments`;
    console.log(url);
    const response = await fetch(url, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(apiKey + ':').toString('base64'),
      },
    })

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch data from Companies House' })
    }

    const data = await response.json()
    res.status(200).json(data)
  } catch (error: any) {
    res.status(500).json({ error: 'Something went wrong', details: error.message })
  }
}
