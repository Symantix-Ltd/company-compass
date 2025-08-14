"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { QuestionMarkCircleIcon, UserCircleIcon } from "@heroicons/react/24/outline";


export default function Footer() {
    const callbackModal = () => {
      // Your callback modal function logic here
      alert("Callback modal triggered!");
    };
  
    return (
      <footer className="bg-gray-900 text-gray-300 px-6 py-10">
   
  
        <div className="grid grid-cols-1 md:grid-cols-6 gap-y-8 gap-x-16">
          {/* Logo */}
          <div className="f-heading-9  text-gray-200">
            Company Compass UK
          </div>
  
          {/* Company */}
          <div>
            <h3 className="mb-3 font-semibold text-white">&nbsp;</h3>
            <a href="/about" className="block mb-1 hover:underline">
              About
            </a>
            <a href="/careers" className="block mb-1 hover:underline">
              Careers
            </a>
          </div>
  
          {/* Products & Services */}
          <div>
            <h3 className="mb-3 font-semibold text-white">Products & Services</h3>
            <a href="/app" className="block mb-1 hover:underline">
              App
            </a>
            <a href="/reports" className="block mb-1 hover:underline">
              Reports
            </a>
          </div>
  
          {/* Search */}
          <div>
            <h3 className="mb-3 font-semibold text-white">Search</h3>
            <a href="/products/company-search" className="block mb-1 hover:underline">
              Company
            </a>
            <a href="/products/director-search" className="block mb-1 hover:underline">
              Director
            </a>
          </div>
  
          {/* Help */}
          <div>
            <h3 className="mb-3 font-semibold text-white">Help</h3>
            <a href="/help" className="block mb-1 hover:underline">
              Help Centre
            </a>
            <a href="/help/terms-of-use" className="block mb-1 hover:underline">
              Terms of Use
            </a>
            <a href="/help/privacy-policy" className="block mb-1 hover:underline">
              Privacy Policy
            </a>
          </div>
  
          {/* Copyright */}
          <div className="md:col-span-6 text-right mt-10 border-t border-gray-700 pt-6 text-sm text-gray-500 leading-relaxed">
            Company Compass UK © 2025 is brought to you by Symantix Ltd (Company No. 05672247) a company registered in England and Wales.
            
            
          </div>
        </div>
      </footer>
    );
  }
  
 

/*



 <header className="bg-white shadow-md p-6 flex justify-between items-center p-4 ">
          <div>
      <h1 className="f-heading-3  font-bold tracking-tight"><a href="/">UK Company Insights</a></h1>
</div>
<div className="flex space-x-2">
      <a href="/help/"><QuestionMarkCircleIcon className="size-8 text-blue-500"/></a><a href="/sign-in/"><UserCircleIcon className="size-8 text-blue-500"/></a>
      </div>
    </header>

    */