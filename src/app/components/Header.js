"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { QuestionMarkCircleIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import SearchBar from "./SearchBar";


export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 p-4 v-[2px]   border-b ">
    <div className="max-w-7xl mx-auto flex justify-between items-left">
      {/* Logo + Company name + Byline */}
      <div className="flex items-center space-x-3">
      <a href="/"><img style={{ width: 50 }} src="/compass.png" alt="Company Compass logo" /></a>
        <div className="flex flex-col leading-tight">
          <div className=" font-bold tracking-tight">
            <a href="/" className="text-2xl">Company Compass</a>
          </div>
          <p className=" text-gray-600">Transforming Business Intelligence into Actionable Insights</p>
        </div>
      </div>


      {/* Desktop Menu */}
      <nav className="hidden md:flex space-x-6 text-sm">
      
      <a href="/company-notices/company-insolvency" className="hover:text-blue-500">Company Insolvency News</a>
      <a href="/search" className="hover:text-blue-500">Company Search</a>
      <a href="/search/person" className="hover:text-blue-500">Person Search</a>
      <a href="/explorer/postcode" className="hover:text-blue-500">Postcode Search</a>
      <a href="/newsletter" className="hover:text-blue-500">Newsletter</a>
       
       
    {/*    <a href="/help/" className="text-blue-500"><QuestionMarkCircleIcon className="size-8" /></a>
        <a href="/sign-in/" className="text-blue-500"><UserCircleIcon className="size-8" /></a> */}
      </nav>
  
      {/* Mobile Menu Button */}
      <button
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>

 
  
    {/* Mobile Menu Dropdown */}
    {isOpen && (
      <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
        <nav className="flex flex-col p-4 space-y-4">
       
        <a href="/company-notices/company-insolvency" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>Company Insolvency UK</a>
         
        <a href="/search" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>Company Search</a>
        <a href="/search/person" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>Person Search</a>
         
        <a href="/explorer/postcode" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>Postcode Search</a>
        <a href="/insights" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>Insights</a>
          <a href="/" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>Home</a>
     <a href="/#about" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>About</a>
          <a href="/#contact" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>Contact</a>
          { /*   <a href="/help/" onClick={() => setIsOpen(false)}>Help</a>
          <a href="/sign-in/" onClick={() => setIsOpen(false)}>Sign in</a> */} 
        </nav>
      </div>
    )}
  </header>
  
  );
}


/*



 <header className="bg-white shadow-md p-6 flex justify-between items-center p-4 ">
          <div>
      <h1 className="  font-bold tracking-tight"><a href="/">UK Company Insights</a></h1>
</div>
<div className="flex space-x-2">
      <a href="/help/"><QuestionMarkCircleIcon className="size-8 text-blue-500"/></a><a href="/sign-in/"><UserCircleIcon className="size-8 text-blue-500"/></a>
      </div>
    </header>

    */