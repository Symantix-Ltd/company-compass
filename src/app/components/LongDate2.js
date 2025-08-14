import React from "react";

const LongDate = ({ date }) => {
  const dateObj = new Date(date);

  // Format date in long form
  const longDate = dateObj.toLocaleDateString("en-UK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Days difference calculation
  const today = new Date();
  dateObj.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = dateObj.getTime() - today.getTime();
  const diffDays = Math.abs(Math.round(diffTime / (1000 * 60 * 60 * 24)));

  return (
    <span>
      {diffDays} Days Ago on {longDate} 
    </span>
  );
};

export default LongDate;
