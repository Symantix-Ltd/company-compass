'use client';

import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useParams } from 'next/navigation';

interface NoticeDateNavigationProps {
  baseUrl: string;
  currentDate: string; // expected in 'YYYY-MM-DD' format
  previousDate: string;
  nextDate: string| null;
}

export default function NoticeDateNavigation({ baseUrl, currentDate, previousDate, nextDate }: NoticeDateNavigationProps) {
  const today = new Date();
  const parsedCurrentDate = new Date(currentDate);

  if (isNaN(parsedCurrentDate.getTime())) return null;

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date: Date): string =>
    date.toISOString().split('T')[0];

  // Calculate previous and next dates
  //const prevDate = new Date(parsedCurrentDate);
  //prevDate.setDate(parsedCurrentDate.getDate() - 1);

  //const nextDate = new Date(parsedCurrentDate);
  //nextDate.setDate(parsedCurrentDate.getDate() + 1);

  const isToday = formatDate(parsedCurrentDate) === formatDate(today);

  return (
    <div className="flex items-center text-pink-800 font-bold py-5">
      <CalendarIcon className="h-6 w-6 mr-2" />

      {/* Left chevron → previous date */}
      <a href={`${baseUrl}/${previousDate}`} className="mx-1" aria-label="Previous day">
        <ChevronLeftIcon className="h-6 w-6 hover:text-pink-600" />
      </a>

      {/* Displayed date */}
      <span className="mx-2">
        {parsedCurrentDate.toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </span>

      {/* Right chevron → next date (only if not today) */}
      {!isToday && (
        <a href={`${baseUrl}/${nextDate}`} className="mx-1" aria-label="Next day">
          <ChevronRightIcon className="h-6 w-6 hover:text-pink-600" />
        </a>
      )}
    </div>
  );
}
