'use client';

export default function SubstackEmbed() {
  return (
    <div>
      <p>
        Subscribe to our newsletter for regular updates on company news,
        including insolvency notices and useful business insights.
      </p>
      <br />
      <iframe
        src="https://companycompass.substack.com/embed"
        width="100%"
        height="200"
        style={{ border: '1px solid #ccc', borderRadius: '4px', background: 'white' }}
        frameBorder="0"
        scrolling="no"
      ></iframe>
    </div>
  );
}
