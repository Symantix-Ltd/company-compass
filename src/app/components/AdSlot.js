'use client'

import { useEffect } from 'react'

export default function AdSlot({ styleDef="display: 'block'", client, slot, format = 'auto', responsive = 'true', layout="" }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('AdSense error:', e)
    }
  }, [])

  return (

    <div> 
      <script async src={'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + client }
     crossorigin="anonymous"></script>
    <ins className="adsbygoogle"
      style={{styleDef}}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-ad-layout-key={layout}
      data-full-width-responsive={responsive}
    ></ins>

</div>
  )
}

