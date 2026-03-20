import { useAuth } from "./auth.jsx";

export default function HeaderBar({title="Dashboard"}){
    var {user}=useAuth();
    user=user?user:"john"
    return (
        <div className=" bg-white h-[63px] flex items-center justify-between px-8 mb-10 ">
        <div className="flex items-center">
          <h1 
            className="font-['Roboto:Medium',sans-serif] font-medium text-[22px] text-black tracking-[0.1px]"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            {title}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <p 
            className="font-['Roboto:Medium',sans-serif] font-medium text-[22px] text-black tracking-[0.1px]"
            style={{ fontVariationSettings: "'width' 100" }}
          >
                {user}
          </p>
          <div className="h-[46px] w-[47px] relative">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 67 66">
              <ellipse cx="33.5" cy="33" fill="#EADDFF" rx="33.5" ry="33" />
            </svg>
            <div 
              className="absolute inset-0 flex items-center justify-center font-['Roboto:Medium',sans-serif] font-medium text-[16px] text-[#72323f] tracking-[0.1px]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              HR
            </div>
          </div>
        </div>
      </div>
    )
}
