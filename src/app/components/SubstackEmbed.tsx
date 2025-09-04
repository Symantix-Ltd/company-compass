'use client';
import { useEffect } from 'react';

export default function SubstackEmbed() {
  useEffect(() => {
    // Only run on client
    const script = document.createElement('script');
    script.src = 'https://substackapi.com/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Configure Substack widget
    window.CustomSubstackWidget = {
      substackUrl: 'companycompass.substack.com',
      placeholder: 'contact@gmail.com',
      buttonText: 'Subscribe',
      theme: 'custom',
      colors: {
        primary: 'skyblue',
        input: 'white',
        email: 'silver',
        text: '#000000',
      },
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="custom-substack-embed" />;
}
