import React from "react";

const LongDate3 = ({ date }) => {
  const dateObj = new Date(date);

  // Format date in long form
  const longDate = dateObj.toLocaleDateString("en-UK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });


  return (longDate);
};

export default LongDate3;
