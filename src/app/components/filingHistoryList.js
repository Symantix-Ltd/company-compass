// components/FilingHistoryList.js

import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";

import { DocumentIcon } from "@heroicons/react/24/solid";
import LongDate3 from './LongDate3';




export default function FilingHistoryList({ filings, companyNumber }) {


    return (

        
      <div className="list">  

        {filings.items.slice(0, 8).map((data, i) => (

            
          <div key={i} className="info-item -add-icon flex items-start gap-6">
            <DocumentIcon className="size-6 text-blue-500"/>
  
            {/* Filing info */}
            <div className="flex-1">
              <div className="">{data.description.replace(/-/g, " ")} {data.action_date && (
          <>
            {" "}made on <LongDate3 date={data.action_date} />
          </>
        )}</div>
              <div className="text-xs">Submitted on <LongDate3 date={data.date}/></div>
              <br/>
            </div>
  
            {/* Download button */}
            <a
              className="button-download shrink-0"
              target="_blank"
              rel="noopener noreferrer"
              href={`/api/company/${companyNumber}/files/${data.transaction_id}.pdf`}
            >
              <DocumentArrowDownIcon className="size-6 text-blue-500 font-bold"/>
            </a>
          </div>
        ))}
  
        {/* Optional fade-out overlay */}
        <div className="fade-out"></div>
      </div>
    );
  }
  
  