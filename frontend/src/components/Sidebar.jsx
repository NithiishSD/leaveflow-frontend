import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth.jsx';
const Sidebar = ({name}) => {
  const navigate = useNavigate();
  var {role}=useAuth()
  // role="employee"   //    !!!!!!!!!!!!!!!!!!!!!!!!!!! pavvan it is just for checking so that we can remove it later and use that when backend works
  const isActive = (pageName) => name === pageName;
  const activeClass = 'bg-[#d1d5db] font-bold text-gray-900 shadow-sm cursor-pointer';
  const inactiveClass = 'hover:bg-gray-200 text-gray-500 font-medium cursor-pointer';
  
  return (
    <aside className="w-56 bg-[#f0f0f0] p-6 hidden lg:flex flex-col h-screen sticky top-0 font-['Roboto:Medium',sans-serif]">
      <div className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-10 tracking-[0.1px]">
        <span className="text-gray-800 text-lg">✦</span> LeaveFlow
      </div>
      <nav className="flex-1">
        <p className="text-[11px] text-gray-500 mb-3 ml-2 font-medium tracking-[0.1px]">Menu</p>
        <div className="space-y-1">
          <div className={`flex items-center gap-3 p-2.5 rounded-lg font-medium tracking-[0.1px] ${isActive('dashboard') ? activeClass : inactiveClass}`}>
            <span className="text-lg leading-none">⊞</span>
            <button onClick={() => navigate(`/${role}`)}>Dashboard</button>
          </div>
          <div className={`flex items-center gap-3 p-2.5 rounded-lg font-medium tracking-[0.1px] ${isActive('requests') ? activeClass : inactiveClass}`}>
            <span className="text-lg leading-none">✉</span>
            <button onClick={() => {navigate('/requests')}}>Leave Request</button>
          </div>
          {role!=="employee"&&(<div className={`flex items-center gap-3 p-2.5 rounded-lg font-medium tracking-[0.1px] ${isActive('requests-received') ? activeClass : inactiveClass}`}>
            <span className="text-lg leading-none">📄</span>
            <button onClick={()=>navigate('/requests-received')}>Requests</button>
          </div>)}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
