import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Example stub for input handler (you can connect API or logic here)
  function searchInput(value) {
    setQuery(value);
    // TODO: fetch/update suggestions here
    // setSuggestions([...]);
  }

  // Example stub for keydown handler (e.g., handle Enter key)
  function searchKeydown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleSubmit() {
    // For demo: redirect to search with query param
    if (!query.trim()) return;
    window.location.href = `/search/?q=${encodeURIComponent(query)}`;
  }

  return (
    <form
      id="search_form"
      method="get"
      action="/search/"
      onSubmit={(e) => e.preventDefault()}
      className="flex-grow max-w-4xl relative"
    >
      <div className="company-search-input flex items-center border border-gray-300 rounded-md overflow-hidden">
        <input
          type="text"
          autoComplete="off"
          id="q"
          name="q"
          placeholder="Search a Company or Director"
          className="flex-grow px-4 py-2 outline-none"
          value={query}
          onInput={(e) => searchInput(e.target.value)}
          onKeyDown={searchKeydown}
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center"
          aria-label="Search"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <div
          id="search_suggestions"
          className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto z-10"
        >
          {suggestions.map((sug, idx) => (
            <div
              key={idx}
              className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
              onClick={() => {
                setQuery(sug);
                setSuggestions([]);
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
