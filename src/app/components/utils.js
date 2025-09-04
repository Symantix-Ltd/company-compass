// utils.js
export const LongDate = ({ date }) => {
    const dateObj = new Date(date);
    const longDate = dateObj.toLocaleDateString("en-UK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return <>{longDate}</>;
  };
  
  export const MonthsSince = ({ date }) => {
    const startDate = new Date(date);
    const today = new Date();
    const months = (today.getFullYear() - startDate.getFullYear()) * 12 +
                   (today.getMonth() - startDate.getMonth());
    return <>{months < 0 ? 0 : months}</>;
  };
  
  export const MonthsUntil = ({ date }) => {
    const targetDate = new Date(date);
    const today = new Date();
    const months = (targetDate.getFullYear() - today.getFullYear()) * 12 +
                   (targetDate.getMonth() - today.getMonth());
    return <>{months < 0 ? 0 : months}</>;
  };
  
  export const parseDMY = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };
  
  export const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes("/")) return parseDMY(dateStr);
    return new Date(dateStr);
  };
  
  export function YearsSince(dateInput) {
    if (!dateInput) return null;
    const dateStr = typeof dateInput === 'string' ? dateInput : dateInput.date;
    if (!dateStr) return null;
    const parts = dateStr.split('-').map(Number);
    if (parts.length !== 3) return null;
    const startDate = new Date(parts[0], parts[1] - 1, parts[2]);
    const today = new Date();
    let years = today.getFullYear() - startDate.getFullYear();
    if (today.getMonth() < startDate.getMonth() ||
        (today.getMonth() === startDate.getMonth() && today.getDate() < startDate.getDate())) {
      years--;
    }
    return years;
  }
  