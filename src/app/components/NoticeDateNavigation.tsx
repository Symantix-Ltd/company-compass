'use client';

import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useParams } from 'next/navigation';

interface NoticeDateNavigationProps {
  baseUrl: string;
}

export default function NoticeDateNavigation({ baseUrl }: NoticeDateNavigationProps) {
  const params = useParams();


  // Ensure daysAgoParam is a string
const daysAgoParamRaw = params?.['days-ago'] || '0';
const daysAgoParam = Array.isArray(daysAgoParamRaw) ? daysAgoParamRaw[0] : daysAgoParamRaw;

if (!daysAgoParam) return null;
const daysAgo = parseInt(daysAgoParam, 10);



  // Compute new days-ago values for chevrons
  const prevDaysAgo = daysAgo + 1; // left chevron → older
  const nextDaysAgo = Math.max(daysAgo - 1, 0); // right chevron → newer, min 0

  // Compute the displayed date based on daysAgo
  const displayedDate = new Date();
  displayedDate.setDate(displayedDate.getDate() - daysAgo);

  return (
    <div className="flex items-center text-pink-800 font-bold py-5 ">
      <CalendarIcon className="h-6 w-6 mr-2" />

      {/* Left chevron → add 1 to days-ago */}
      <a href={`${baseUrl}/${prevDaysAgo}`} className="mx-1">
        <ChevronLeftIcon className="h-6 w-6 hover:text-pink-600" />
      </a>

      {/* Displayed date */}
      <span>
        {displayedDate.toLocaleDateString('en-UK', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </span>

      {/* Right chevron → subtract 1 from days-ago, min 0 */}
      <a href={`${baseUrl}/${nextDaysAgo}`} className="mx-1">
        <ChevronRightIcon className="h-6 w-6 hover:text-pink-600" />
      </a>
    </div>
  );
}
