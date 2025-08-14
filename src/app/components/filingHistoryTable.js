// components/FilingHistoryTable.js
import React from 'react';

export default function FilingHistoryTable({ filingHistory }) {
  if (!filingHistory || !filingHistory.items) {
    return <p>No filing history available.</p>;
  }

  return (
    <div>
     
      <table border="1" cellPadding="8" cellSpacing="0" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
         
            <th>Date</th>
            
           
            <th>Description</th>
            
           
          </tr>
        </thead>
        <tbody>
          {filingHistory.items.slice(0, 8).map((item) => (
            <tr key={item.transaction_id}>
            
            
              <td>{item.date}</td>
             
              <td>{item.description.replace(/-/g, " ")}</td>
              
             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
