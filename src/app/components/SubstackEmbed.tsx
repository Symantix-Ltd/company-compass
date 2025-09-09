'use client';
import { useEffect } from 'react';

export default function SubstackEmbed() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://substackapi.com/widget.js';
    script.async = true;
    document.body.appendChild(script);

    window.CustomSubstackWidget = {
      substackUrl: 'companycompass.substack.com',
      placeholder: 'contact@gmail.com',
      buttonText: 'Subscribe',
      theme: 'custom',
      colors: { primary: 'royalblue', input: '', email: 'royalblue', text: 'white' },
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <p>
        Subscribe to our newsletter for regular updates on company news, including insolvency notices and useful business insights.
      </p>
      <br />
      <div id="custom-substack-embed" className="flex w-full" />
    </div>
  );
}
