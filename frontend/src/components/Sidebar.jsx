import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth.jsx';
const Sidebar = ({name}) => {
  const navigate = useNavigate();
  var {role}=useAuth()
  role="HR"
  const handleRequestReceived = () => {
    navigate('/requests-received');
  };
  const status = name === 'requests' ? true : false;
  return (
    <aside className="w-56 bg-[#f0f0f0] p-6 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-10">
        <span className="text-gray-800 text-lg">✦</span> LeaveFlow
      </div>
      <nav className="flex-1">
        <p className="text-[11px] text-gray-500 mb-3 ml-2">Menu</p>
        <div className="space-y-1">
          <div className={`flex items-center gap-3 p-2.5 rounded-lg ${status ? 'hover:bg-gray-200 text-gray-500 font-medium cursor-pointer' : 'bg-[#d1d5db] font-bold text-gray-900 shadow-sm cursor-pointer'}`}>
            <span className="text-lg leading-none">⊞</span>
            <button onClick={() => navigate(`/${role}`)}>Dashboard</button>
          </div>
          <div className={`flex items-center gap-3 p-2.5 rounded-lg ${!status ? 'hover:bg-gray-200 text-gray-500 font-medium cursor-pointer' : 'bg-[#d1d5db] font-bold text-gray-900 shadow-sm cursor-pointer'}`}>
            <span className="text-lg leading-none">✉</span>
            <button onClick={() => {navigate('/requests')}}>Leave Request</button>
          </div>
          <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-200 text-gray-500 font-medium cursor-pointer">
            <span className="text-lg leading-none">🕑</span>
            <button onClick={handleRequestReceived}>Request Received</button>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
