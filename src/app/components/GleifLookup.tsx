'use client'

import { useState } from 'react'

interface GleifLookupProps {
  placeholder?: string
}

export default function GleifLookup({ placeholder = "Enter UK Company Number" }: GleifLookupProps) {
  const [companyNumber, setCompanyNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!companyNumber.trim()) {
      setError('Please enter a valid company number.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(`/api/gleif?companyNumber=${companyNumber}`)
      const data = await res.json()

      if (res.ok) {
        setResult(data)
      } else {
        setError(data?.error || 'Unknown error')
      }
    } catch (err: any) {
      setError('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '600px' }}>
      <input
        type="text"
        value={companyNumber}
        onChange={(e) => setCompanyNumber(e.target.value)}
        placeholder={placeholder}
        style={{ padding: '0.5rem', fontSize: '1rem', marginRight: '1rem', width: '60%' }}
      />
      <button onClick={handleSearch} style={{ padding: '0.5rem 1rem' }}>
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Results:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f4f4f4', padding: '1rem' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
