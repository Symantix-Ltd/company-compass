"use client";

export const dynamic = "force-dynamic"; // disables static caching


import { useState } from "react";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

export default function SearchFormPerson() {
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
    router.push(`/search/person?q=${encodeURIComponent(query.trim())}`);
  }


  return (

    
                   
    
    <form onSubmit={handleSubmit} className="flex-grow max-w-4xl relative">
    <div className="flex items-center bg-blue-200 p-2 rounded overflow-hidden border-2 border-blue-500">
      <input
        type="text"
        autoComplete="off"
        name="q"
        placeholder="Search for a Person"
        className="flex-grow px-2 py-2"
        value={query}
        onChange={(e) => handleInput(e.target.value)}
      />
      
      <button
        type="submit"
        className="p-2 rounded hover:bg-blue-200"
        aria-label="Search"
      >
        <MagnifyingGlassIcon className="w-6 h-6 text-blue-600" />
      </button>
    </div>
  </form>
    
  );
}
