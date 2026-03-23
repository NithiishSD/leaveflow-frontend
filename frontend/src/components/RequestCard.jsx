import React, { useState } from 'react';
import { useLeave } from './LeaveContext';
import RequestDetailsModal from './RequestDetailsModal';

const RequestCard = ({ req }) => {
  const { handleAction } = useLeave();
  const [isOpen, setIsOpen] = useState(false);
  const getDotColor = (type) => {
    const t = (type || '').toString().toUpperCase();
    if (t === 'EMERGENCY') return 'bg-red-500';
    if (t === 'VACATION') return 'bg-purple-500';
    return 'bg-blue-500';
  };
  const calculateDays = (start, end) => {
    const diffTime = Math.abs(new Date(end) - new Date(start));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };
  const formatRange = (start, end) => {
    const options = { day: 'numeric', month: 'long' };
    const s = new Date(start).toLocaleDateString('en-GB', options);
    const e = new Date(end).toLocaleDateString('en-GB', options);
    return `${s} - ${e}`;
  };
  const createdDate = new Date(req.created_at || Date.now()).toLocaleDateString('en-GB');

  return (
    <div className="bg-[#e5e5e5] p-5 rounded-2xl shadow-sm relative font-['Roboto:Medium',sans-serif]">
      <div className="flex justify-between items-start mb-4">
        {/* Left Side: Dot, Name, Date */}
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full ${getDotColor(req.type)}`} />
          <div className="leading-tight">
            <div className="text-sm font-medium text-gray-800 tracking-[0.1px]">
              {req.employee?.name || req.employee_id || "Employee"}
            </div>
            <div className="text-[10px] text-gray-500 font-medium tracking-[0.1px]">{createdDate}</div>
            {req.manager_id && req.approval_events && req.approval_events.length > 0 && (
              <div className="text-[9px] text-blue-600 font-medium tracking-[0.1px] mt-1">
                ✓ Handled by: {req.approval_events[req.approval_events.length - 1].actor?.name || req.manager_id}
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right leading-tight">
          <div className="text-xs text-gray-700 capitalize font-medium tracking-[0.1px]">{req.type?.toLowerCase() || 'Leave'}</div>
          <div className="text-xs font-bold text-gray-800 mt-1 tracking-[0.1px]">
            {calculateDays(req.start_date, req.end_date)} days
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="font-bold text-gray-900 text-sm tracking-[0.1px]">{req.reason || "Personal"}</div>
        <div className="text-[11px] text-gray-600 mt-0.5 font-medium tracking-[0.1px]">
          {formatRange(req.start_date, req.end_date)}
        </div>
      </div>
      <div className="flex justify-end items-center gap-3">
        <button 
          onClick={() => handleAction(req.id, 'deny')}
          className="px-3 py-1 bg-[#fbcfe8] text-[#be123c] rounded text-xs font-medium hover:bg-pink-300 transition-colors tracking-[0.1px]"
        >
          Deny
        </button>
        <button 
          onClick={() => handleAction(req.id, 'approve')}
          className="px-3 py-1 bg-[#bbf7d0] text-[#15803d] rounded text-xs font-medium hover:bg-green-300 transition-colors tracking-[0.1px]"
        >
          Approve
        </button>
        <button className="text-[#3b82f6] text-xs font-medium ml-1 hover:underline tracking-[0.1px]" onClick={() => setIsOpen(true)}>
          Details
        </button>
      </div>

      <RequestDetailsModal 
        req={req}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onApprove={(id) => {
          handleAction(id, 'approve');
          setIsOpen(false);
        }}
        onReject={(id) => {
          handleAction(id, 'deny');
          setIsOpen(false);
        }}
        onReturn={(id) => {
          handleAction(id, 'return');
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export default RequestCard;
