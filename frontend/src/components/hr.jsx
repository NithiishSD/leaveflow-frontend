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
      <div className={`${bgColor} rounded-2xl md:rounded-[42px] p-5  shadow-sm flex flex-col items-center justify-center h-[60px] font-['Roboto:Medium',sans-serif]`}>
        <h3 className="text-md   text-black font-medium text-center tracking-[0.1px]">
          {title}
        </h3>
        <p className="text-2xl md:text-3xl text-black font-bold tracking-[0.1px]">
          {value}
        </p>
      </div>
    );
  }
  
export default function HR() {
    const { stats, requests, loading } = useLeave();
    return (
        <div className="flex min-h-screen bg-[#e0e0e0] font-['Roboto:Medium',sans-serif] gap-4 flex-col md:flex-row">
    <Sidebar name = 'dashboard'/>
    
    <main className="flex-1 px-4 md:px-6 py-4 md:py-6 overflow-y-auto">
      <HeaderBar title="Welcome HR" />
            
      <section className="mt-6 bg-white rounded-2xl shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <StatsCard title="Pending Request" value="0" variant="white" />
                    <StatsCard title="Currently on leave" value="100" variant="gray" />
                    <StatsCard title="Approved this month" value="50" variant="white" />
                    <StatsCard title="New Request" value="20" variant="light-gray" />
                    <StatsCard title="Rejected" value="10" variant="gray" />
                    <StatsCard title="Returned" value="5" variant="light-gray" />
            </div>
      </section>
      
      <section className="mt-6 bg-white rounded-2xl shadow-sm p-8 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-[0.1px]">Quick Approval</h3>
          {loading ? (
            <div className="text-gray-400 font-medium py-10 animate-pulse tracking-[0.1px]">Loading requests...</div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {requests.length > 0 ? (
                requests.map(req => <RequestCard key={req.id} req={req} />)
              ) : (
                <div className="col-span-full py-10 text-center text-gray-500 font-medium bg-gray-50 rounded-xl tracking-[0.1px]">
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
