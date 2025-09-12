'use client';

import React from 'react';
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

function Dropdown({ item, isActive }: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href={item.route}
        className={`px-6 py-2 border border-gray-700 ${
          isActive ? 'bg-white text-gray-900' : 'bg-gray-200 text-gray-700'
        } hover:bg-white hover:text-gray-900 transition`}
      >
        {item.title}
      </Link>

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
              className="px-4 py-2 text-gray-700 hover:bg-gray-100"
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

  const menuItems: MenuItem[] = [
    {
      title: 'Companies House Data',
      route: `${basePath}/companies-house-data`,
      children: [
        { title: 'Summary', route: `${basePath}/companies-house-data#summary` },
        { title: 'Directors & Secretaries', route: `${basePath}/companies-house-data#directors-and-secretaries` },
      ],
    },
    {
      title: 'Gazette Notices',
      route: `${basePath}/gazette-notices`,
    },
    {
      title: 'Documents',
      route: `${basePath}/documents`,
    },
    {
      title: 'Contact',
      route: `${basePath}/contact`,
      children: [{ title: 'Company Addresses', route: '#company-addresses' }],
    },
  ];

  return (
    <div className="top-5 z-50 py-1 px-0">
      {/* ✅ Mobile SEO-friendly links */}
      <div className="md:hidden px-2 flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.route}
            href={item.route}
            className="block px-3 py-2 border border-gray-300 rounded bg-gray-500 hover:bg-gray-400 rounded text-sm text-white"
          >
            {item.title}
          </Link>
        ))}
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:flex whitespace-nowrap gap-1 px-1 py-0 text-sm">
        {menuItems.map((item) => {
          const isActive = Boolean(
            pathname === item.route ||
              pathname.startsWith(item.route) ||
              (item.children &&
                item.children.some(
                  (child) => pathname === child.route || pathname.startsWith(child.route)
                ))
          );

          return <Dropdown key={item.route} item={item} isActive={isActive} />;
        })}
      </div>
    </div>
  );
}
