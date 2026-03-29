import { useAuth } from "./auth.jsx";

export default function HeaderBar({title="employee"}){
    var {user,role}=useAuth();
    user.username=user?user.username:"john"
    if (role=="manager"){
      role="MR"
    }
    else if(role=="employee"){
      role="EM"
    }
    return (
        <div className=" bg-white h-[63px] flex items-center justify-between px-8 mb-10 rounded-[10px]">
        <div className="flex items-center">
          <h1 
            className="font-['Roboto:Medium',sans-serif] font-bold text-[22px] text-black tracking-[0.1px]"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            {title}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <h3
            className="font-['Roboto:Medium',sans-serif] font-medium text-[22px] text-black tracking-[0.1px]"
            style={{ fontVariationSettings: "'wdth' 100" }}>
                {user.username}
          </h3>
          <div className="h-[46px] w-[47px] relative">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 67 66">
              <ellipse cx="33.5" cy="33" fill="#EADDFF" rx="33.5" ry="33" />
            </svg>
            <div 
              className="absolute inset-0 flex items-center justify-center font-['Roboto:Medium',sans-serif] font-medium text-[16px] text-[#72323f] tracking-[0.1px]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {role}
            </div>
          </div>
        </div>
      </div>
    )
}
