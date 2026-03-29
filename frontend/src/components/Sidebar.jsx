import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import { X } from 'lucide-react';
import { useSidebar } from './SidebarContext.jsx';

const Sidebar = ({name}) => {
  const navigate = useNavigate();
  const {role, user} = useAuth();
  const { isOpen, closeSidebar } = useSidebar();
  
  const isActive = (pageName) => name === pageName;
  const activeClass = 'bg-[#d1d5db] font-bold text-gray-900 shadow-sm cursor-pointer';
  const inactiveClass = 'hover:bg-gray-200 text-gray-500 font-medium cursor-pointer';
  
  const handleNavigation = (path) => {
    navigate(path);
    closeSidebar();
  };

  const handleDashboardClick = () => {
    handleNavigation(`/${role}/${user.id}`);
  };

  const handleRequestsClick = () => {
    handleNavigation('/requests');
  };

  const handleReceivedRequestsClick = () => {
    handleNavigation('/requests-received');
  };
  
  return (
    <>
      {/* Mobile Overlay - Full screen, closes on click */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30 backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Clean sliding panel */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-40 
        w-56 bg-white shadow-xl lg:shadow-none flex flex-col font-['Roboto:Medium',sans-serif]
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:w-56 lg:flex lg:bg-[#f0f0f0]
      `}>
        {/* Header section with padding for mobile */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 lg:border-b-0">
          <div className="flex items-center gap-2 text-xl font-bold text-gray-900 tracking-[0.1px]">
            <span className="text-gray-800 text-lg">✦</span> LeaveFlow
          </div>
          {/* Close button on mobile only */}
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={closeSidebar}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation section */}
        <nav className="flex-1 p-6 lg:pb-10">
          <p className="text-[11px] text-gray-500 mb-3 ml-2 font-medium tracking-[0.1px]">Menu</p>
          <div className="space-y-1">
            <div className={`flex items-center gap-3 p-2.5 rounded-lg font-medium tracking-[0.1px] transition-all ${isActive('dashboard') ? activeClass : inactiveClass}`}>
              <span className="text-lg leading-none">⊞</span>
              <button onClick={handleDashboardClick} className="w-full text-left">Dashboard</button>
            </div>
            <div className={`flex items-center gap-3 p-2.5 rounded-lg font-medium tracking-[0.1px] transition-all ${isActive('requests') ? activeClass : inactiveClass}`}>
              <span className="text-lg leading-none">✉</span>
              <button onClick={handleRequestsClick} className="w-full text-left">Leave Request</button>
            </div>
            {role !== "employee" && (
              <div className={`flex items-center gap-3 p-2.5 rounded-lg font-medium tracking-[0.1px] transition-all ${isActive('requests-received') ? activeClass : inactiveClass}`}>
                <span className="text-lg leading-none">📄</span>
                <button onClick={handleReceivedRequestsClick} className="w-full text-left">Requests</button>
              </div>
            )}
          </div>
        </nav>

        {/* Footer section with border */}
        <div className="p-6 border-t border-gray-200">
          <p className="text-xs text-gray-400 font-medium tracking-[0.1px]">© 2024 LeaveFlow</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
