import Sidebar from "./Sidebar.jsx";
import HeaderBar from "./HeaderBar.jsx";
import RequestCard from "./RequestCard.jsx";
import {useLeave} from "./LeaveContext.jsx"
function StatsCard({ title, value, variant = 'white' }) {
    const bgColor = {
      'white': 'bg-[#fefefe]',
      'gray': 'bg-[#c9c9c9]',
      'light-gray': 'bg-[#f6f6f6]'
    }[variant];
  
    return (
      <div className={`${bgColor} rounded-2xl md:rounded-[42px] p-5  shadow-sm flex flex-col items-center justify-center h-[60px]`}>
        <h3 className="text-md   text-black font-medium text-center ">
          {title}
        </h3>
        <p className="text-2xl md:text-3xl text-black font-medium">
          {value}
        </p>
      </div>
    );
  }
  
export default function HR() {
    const { stats, requests, loading } = useLeave();
    return (
        <div className="flex min-h-screen bg-[#e0e0e0] font-sans gap-4 flex-col md:flex-row">
    <Sidebar name = 'dashboard'/>
    
    <main className="flex-1 bg-[#e0e0e0] shadow-sm px-10 py-4 md:px-12 overflow-y-auto gap-3">
      <HeaderBar title="Welcome HR" />
            
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
   
                    <StatsCard title="Pending Request" value="0" variant="white" />
                    <StatsCard title="Currently on leave" value="100" variant="gray" />
                    <StatsCard title="Approved this month" value="50" variant="white" />
      
      
                    <StatsCard title="New Request" value="20" variant="light-gray" />
                    <StatsCard title="Rejected" value="10" variant="gray" />
                    <StatsCard title="Returned" value="5" variant="light-gray" />
                    </div>
                    <section>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Approval</h3>
          {loading ? (
            <div className="text-gray-400 font-medium py-10 animate-pulse">Loading requests...</div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {requests.length > 0 ? (
                requests.map(req => <RequestCard key={req.id} req={req} />)
              ) : (
                <div className="col-span-full py-10 text-center text-gray-500 font-medium bg-gray-50 rounded-xl">
                  No requests pending your approval.
                </div>
              )}
            </div>
          )}
        </section>
            </main>
    </div>

    );
}
