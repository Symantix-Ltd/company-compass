// app/components/Breadcrumbs.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface BreadcrumbsProps {
  homeLabel?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ homeLabel = 'Home' }) => {
  const pathname = usePathname();
  if (!pathname) return null;
  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="breadcrumb">
      <ol className="flex space-x-2 font-sm  py-2 g-5 text-blue-500 ">
        <li>
          <Link className="underline " href="/">{homeLabel}</Link>
        </li>
        {segments.map((seg, idx) => {
          const href = '/' + segments.slice(0, idx + 1).join('/');
          const isLast = idx === segments.length - 1;
          const label = seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          return (
            <li key={href}>
              <span> |&nbsp;&nbsp;</span>
              {isLast ? <span>{label}</span> : <Link className="underline " href={href}>{label}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs; // ✅ default export
