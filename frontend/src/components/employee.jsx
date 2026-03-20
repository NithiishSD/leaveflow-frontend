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
  
export default function employee() {
    const { stats, requests, loading } = useLeave();
    return (
        <div className="flex min-h-screen bg-[#e0e0e0] font-sans gap-4 flex-col md:flex-row">
    <Sidebar name = 'dashboard'/>
    
    <main className="flex-1 bg-[#e0e0e0] shadow-sm px-10 py-4 md:px-12 overflow-y-auto gap-3">
      <HeaderBar title="Welcome HR" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
      <div className="mb-6">
        <div className="flex gap-4 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-3 text-xl lg:text-[32px] font-medium transition-colors ${
              activeTab === 'activity'
                ? 'text-black border-b-2 border-black'
                : 'text-[#7b7b7b]'
            }`}
          >
            Leave Activity Tracker
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`pb-3 text-xl lg:text-[32px] font-medium transition-colors ${
              activeTab === 'summary'
                ? 'text-black border-b-2 border-black'
                : 'text-[#7b7b7b]'
            }`}
          >
            Remaining Leave Summary
          </button>
        </div>
      </div>
      {activeTab === 'activity' &&(<>
   <StatsCard title="Total" value="0" variant="white" />
   <StatsCard title="Rejected" value="10" variant="gray" />
   <StatsCard title="Pending Request" value="50" variant="white" />


   <StatsCard title="Approved this month" value="20" variant="light-gray" />
   <StatsCard title="Returned" value="10" variant="gray" /></>
    )}
    {activeTab === 'summary' &&(<div> </div>)}
   </div>
      </main>
      </div>
      )
      }
