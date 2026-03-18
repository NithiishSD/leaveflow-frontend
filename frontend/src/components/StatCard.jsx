import React from 'react';

const StatCard = ({ title, count, shadowColor }) => (
  <div 
    className="flex-1 min-w-[180px] bg-[#e5e5e5] p-6 rounded-2xl"
    style={{ boxShadow: `0px 4px 0px 0px ${shadowColor}` }}
  >
    <p className="text-sm font-semibold text-gray-700">{title}</p>
    <h1 className="text-4xl font-bold mt-2 text-gray-900">{count}</h1>
  </div>
);

export default StatCard;