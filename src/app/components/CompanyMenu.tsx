'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


interface MenuItem {
  title: string;
  route: string;
  children?: MenuItem[];
}

interface DropdownProps {
  item: MenuItem;
  isActive: boolean;
}

// 👇 Use the prop type in the function
function Dropdown({ item, isActive }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);




  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Main Tab as Link */}
      <Link
        href={item.route}
        className={`px-6 py-2 border  border-gray-700     ${
          isActive ? 'bg-white text-gray-900' : 'bg-gray-200 text-gray-700 '
        } hover:bg-white hover:text-gray-900 transition`}
      >
        {item.title}
      </Link>

      {/* Submenu */}
      {item.children && (
        <div
          className={`absolute top-full left-0 z-30 w-[250px] flex flex-col py-2 bg-white border border-gray-200 rounded-md shadow-md ${
            isOpen ? 'flex' : 'hidden'
          }`}
        >
          {item.children.map((child) => (
            <Link
              key={child.route}
              href={child.route}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 "
            >
              {child.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


interface CompanyMenuProps {
  company_number: string;
  company_name: string;
}

export default function CompanyMenu({ company_number, company_name }: CompanyMenuProps) {


  const pathname = usePathname();
  const basePath = `/company/${company_number}/${company_name}`;
  const [selectedMobile, setSelectedMobile] = useState('');

  const handleMobileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedMobile(value);
    if (value) window.location.href = value;
  };


  const menuItems = [
    {
      title: 'Companies House Data',
      route: `${basePath}/companies-house-data`,
      children: [
        { title: 'Summary', route: `${basePath}/companies-house-data#summary` },
        { title: 'Directors & Secretaries', route: `${basePath}/companies-house-data#directors-and-secretaries` },
     
        { title: 'Key Financials', route: `${basePath}/companies-house-data#key-financials` },
      ],
    },
    {
      title: 'Gazette Notices',
      route: `${basePath}/gazette-notices`,
      
    },
   
    {
      title: 'Financials',
      route: `${basePath}/financials`,
      children: [
        { title: 'Key Financials', route: `${basePath}/financials#key-financials` },
       
        { title: 'Accounts Tables', route: `${basePath}/financials#accounts-table` },
      ],
    },
    { title: 'Documents', route: `${basePath}/documents` },
    {
      title: 'Contact',
      route: `${basePath}/contact`,
      children: [
       
        { title: 'Company Addresses', route: '#company-addresses' },
      ],
    },
  ];

  return (
    <div className=" top-5  z-50 py-1 px-0">
      {/* Mobile Dropdown */}
      <div className="md:hidden px-2">
        <select
          className="w-full border border-gray-300 rounded px-1 py-0"
          value={selectedMobile}
          onChange={handleMobileChange}
        >
          {menuItems.map((item) => (
            <option key={item.route} value={item.route}>
              {item.title}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:flex  whitespace-nowrap gap-1 px-1 py-0 ">
      {menuItems.map((item) => {
  // Active tab logic
  const isActive = Boolean(
    pathname === item.route ||
    pathname.startsWith(item.route) ||
    (item.children &&
      item.children.some(
        (child) =>
          pathname === child.route || pathname.startsWith(child.route)
      ))
  );

  return <Dropdown key={item.route} item={item} isActive={isActive} />;
})}


      </div>
    </div>
  );
}


/*

 {
      title: 'Credit Report',
      route: `${basePath}/credit-report`,
      children: [
        { title: 'Credit Score', route: `${basePath}/credit-report#credit-score` },
        { title: 'Credit Limit', route: `${basePath}/credit-report#credit-limit` },
        { title: 'County Court Judgements', route: `${basePath}/credit-report#county-court-judgements` },
        { title: 'Mortgages & Charges', route: `${basePath}/credit-report#mortgages-and-charges` },
        { title: 'Directors & Secretaries', route: `${basePath}/credit-report#director-timeline` },
        { title: 'Payment Data', route: `${basePath}/credit-report#payment-data` },
        { title: 'Shareholders & Ownership', route: `${basePath}/credit-report#shareholders-and-ownership` },
        { title: 'Group Structure', route: `${basePath}/credit-report#group-structure` },
        { title: 'Event History', route: `${basePath}/credit-report#event-history` },
      ],
    },
*/


/*

children: [
        { title: 'Credit Score', route: `${basePath}/credit-report#credit-score` },
        { title: 'Credit Limit', route: `${basePath}/credit-report#credit-limit` },
        { title: 'County Court Judgements', route: `${basePath}/credit-report#county-court-judgements` },
        { title: 'Mortgages & Charges', route: `${basePath}/credit-report#mortgages-and-charges` },
        { title: 'Directors & Secretaries', route: `${basePath}/credit-report#director-timeline` },
        { title: 'Payment Data', route: `${basePath}/credit-report#payment-data` },
        { title: 'Shareholders & Ownership', route: `${basePath}/credit-report#shareholders-and-ownership` },
        { title: 'Group Structure', route: `${basePath}/credit-report#group-structure` },
        { title: 'Event History', route: `${basePath}/credit-report#event-history` },
      ],


         { title: 'Mortgages & Charges', route: `${basePath}/companies-house-data#mortgages-and-charges` },
*/