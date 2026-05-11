import { useAuth } from "./auth.jsx";
import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "./SidebarContext.jsx";

export default function HeaderBar({title="employee"}){
    const {user, role, logout} = useAuth();
    const navigate = useNavigate();
    const { toggleSidebar } = useSidebar();
    
    const displayUsername = user?.username || "john";
    let displayRole = role;
    if (role=="manager"){
      displayRole="MR"
    }
    else if(role=="employee"){
      displayRole="EM"
    }

    const handleLogout = () => {
      logout();
      navigate("/login");
    };

    return (
        <div className="bg-white h-[63px] flex items-center justify-between px-8 mb-10 rounded-[10px] shadow-sm">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button - Inside HeaderBar */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle Menu"
          >
            <Menu size={24} className="text-gray-900" />
          </button>
          <h1 
            className="font-['Roboto:Medium',sans-serif] font-bold text-[22px] text-black tracking-[0.1px]"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            {title}
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <h3
            className="font-['Roboto:Medium',sans-serif] font-medium text-[22px] text-black tracking-[0.1px]"
            style={{ fontVariationSettings: "'wdth' 100" }}>
                {displayUsername}
          </h3>
          <div className="h-[46px] w-[47px] relative">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 67 66">
              <ellipse cx="33.5" cy="33" fill="#EADDFF" rx="33.5" ry="33" />
            </svg>
            <div 
              className="absolute inset-0 flex items-center justify-center font-['Roboto:Medium',sans-serif] font-medium text-[16px] text-[#72323f] tracking-[0.1px]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {displayRole}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Logout"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    )
}
