// components/LatestActivity.js
import React from 'react';
//import LongDate2 from './LongDate2';

/*
function daysBetweenToday(dateString) {
  const targetDate = new Date(dateString);
  const today = new Date();

  // Set times to midnight to avoid partial days
  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();

  // Convert ms to days, get absolute value, round to whole number
  const diffDays = Math.abs(Math.round(diffTime / (1000 * 60 * 60 * 24)));

  return diffDays;
}
*/


const today = "2025-08-12";

export default function LatestActivityTable({ latestActivity }) {
  if (!latestActivity || !latestActivity.items) {
    return <p>No activity available.</p>;
  }

  return (
    <div>
     <br/>
      <ul>
          {latestActivity.items.slice(0, 8).map((item) => (
            

             <li key={item.transaction_id}><span className='font-bold'>{item.category.charAt(0).toUpperCase() + item.category.replace(/-/g, " ").slice(1)} Submitted</span> <br/><span className='text-sm'>{item.date}</span></li>
              
             
            
          ))}
       </ul>
    </div>
  );
}
