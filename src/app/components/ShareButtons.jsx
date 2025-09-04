// components/ShareButtons.jsx
import React from "react";

const ShareButtons = ({ companyName = "Company Name", companyUrl }) => {
  return (
    <div className="share-buttons space-y-1 text-xs">
      <div className="share-buttons-title font-semibold">Share this company:</div>
      <div className="flex flex-wrap gap-1 mt-1">
        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
            `Company Compass: ${companyName} - ${companyUrl}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-2 py-1 bg-green-600 text-white rounded text-[10px] hover:bg-green-700 transition"
        >
          WhatsApp
        </a>

        {/* X / Twitter */}
        <a
          href={`https://x.com/intent/tweet?url=${encodeURIComponent(
            companyUrl
          )}&text=${'Company Compass: ' + encodeURIComponent(companyName)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-2 py-1 bg-black text-white rounded text-[10px] hover:bg-gray-800 transition"
        >
          X
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            companyUrl
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-2 py-1 bg-blue-600 text-white rounded text-[10px] hover:bg-blue-700 transition"
        >
          Facebook
        </a>

       

        {/* Email */}
        <a
          href={`mailto:?subject=${encodeURIComponent(
            companyName
          )}&body=${encodeURIComponent(companyUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-2 py-1 bg-gray-500 text-white rounded text-[10px] hover:bg-gray-600 transition"
        >
          Email
        </a>

        {/* Copy Link */}
        <button
          onClick={() => navigator.clipboard.writeText(companyUrl)}
          className="flex items-center px-2 py-1 bg-gray-400 text-white rounded text-[10px] hover:bg-gray-500 transition"
        >
          Copy Link
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
