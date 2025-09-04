'use client';

import { useState, useMemo } from 'react';
import OfficerItem from './OfficerItem';

export default function CompanyDirectors({ officer_data }) {
  const [showCurrentOnly, setShowCurrentOnly] = useState(true);

  const filteredOfficers = useMemo(() => {
    if (!officer_data?.items) return [];
    return officer_data.items.filter(officer =>
      showCurrentOnly ? !officer.resigned_on : true
    );
  }, [officer_data, showCurrentOnly]);

  const currentCount = officer_data?.items?.filter(o => !o.resigned_on).length || 0;
  const resignedCount = officer_data?.items?.filter(o => o.resigned_on).length || 0;

  return (
    <div className="border border-silver-200 p-10 rounded-lg flex flex-col h-full space-y-4">
      <h2 className="font-bold text-lg">Directors and Secretaries</h2>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showCurrentOnly}
            onChange={() => setShowCurrentOnly(prev => !prev)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          Show current officers only
        </label>

        <div className="text-sm text-gray-500">
          {currentCount} current / {resignedCount} resigned
        </div>
      </div>

      <div className="space-y-6">
        {filteredOfficers?.length > 0 ? (
          filteredOfficers.map((officer, index) => (
            <OfficerItem
              key={`${officer.person_number ?? officer.name}-${index}`}
              officer={officer}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">No officers found.</p>
        )}
      </div>
    </div>
  );
}
