"use client";

export const dynamic = "force-dynamic"; // disables static caching


import { useState } from "react";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

export default function SearchForm() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  function handleInput(value) {
    setQuery(value);
    // Optional: fetch suggestions dynamically here
    // setSuggestions([...]);
  }



  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;

    // Redirect to search page
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }


  return (

    
                   
    
    <form onSubmit={handleSubmit} className="flex-grow max-w-4xl relative">
      <div className="flex items-center  bg-blue-100 p-2 rounded-md overflow-hidden border">
        <input
          type="text"
          autoComplete="off"
          name="q"
          placeholder="Search for a Company"
          className="flex-grow px-2 py-2   "
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit(e);
          }}
        />
        <MagnifyingGlassIcon className="w-10 h-10 px-2  text-blue-600"/>
        <button
          type="submit"
          className="px-1 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center ml-2"
          aria-label="Search"
        >
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300   rounded-md mt-1 max-h-60 overflow-auto z-10">
          {suggestions.map((sug, idx) => (
            <div
              key={idx}
              className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
              onClick={() => {
                setQuery(sug);
                setSuggestions([]);
                window.location.href = `/search?q=${encodeURIComponent(sug)}`;
              }}
            >
              {sug}
            </div>
          ))}
        </div>
      )}
    </form>
    
  );
}
