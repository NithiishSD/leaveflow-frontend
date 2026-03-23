import React from 'react';

const StatCard = ({ title, count, shadowColor }) => (
  <div 
    className="flex-1 min-w-[180px] bg-[#e5e5e5] p-6 rounded-2xl font-['Roboto:Medium',sans-serif]"
    style={{ boxShadow: `0px 4px 0px 0px ${shadowColor}` }}
  >
    <p className="text-sm font-medium text-gray-700 tracking-[0.1px]">{title}</p>
    <h1 className="text-4xl font-bold mt-2 text-gray-900 tracking-[0.1px]">{count}</h1>
  </div>
);

export default StatCard;