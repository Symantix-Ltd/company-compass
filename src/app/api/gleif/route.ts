// app/api/gleif/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const companyNumber = req.nextUrl.searchParams.get('companyNumber')

  if (!companyNumber) {
    return NextResponse.json({ error: 'Missing company number' }, { status: 400 })
  }

  const gleifUrl = `https://api.gleif.org/api/v1/lei-records?filter[entity.registrationAuthority.id]=RA000585&filter[entity.registrationAuthority.entityId]=${companyNumber}`

  try {
    const response = await fetch(gleifUrl)
    if (!response.ok) {
      return NextResponse.json({ error: 'GLEIF API failed' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal error', details: error }, { status: 500 })
  }
}
