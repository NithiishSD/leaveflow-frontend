import Sidebar from "./Sidebar.jsx";
import HeaderBar from "./HeaderBar.jsx";
import RequestCard from "./RequestCard.jsx";
import {useLeave} from "./LeaveContext.jsx"
import { useEffect, useState } from "react";
import { useAuth } from "./auth.jsx";
import apiClient from "../api.js";
function StatsCard({ title, value, variant = 'white' }) {
    const bgColor = {
      'white': 'bg-[#fefefe]',
      'gray': 'bg-[#c9c9c9]',
      'light-gray': 'bg-[#f6f6f6]'
    }[variant];
  
    return (
      <div className={`${bgColor} rounded-xl md:rounded-[22px] p-5  shadow-sm flex flex-col items-center justify-center h-15 font-['Roboto:Medium',sans-serif]`}>
        <h3 className="text-md   text-black font-medium text-center tracking-[0.1px]">
          {title}
        </h3>
        <p className="text-2xl md:text-3xl text-black font-bold tracking-[0.1px]">
          {value}
        </p>
      </div>
    );
  }

function calculateStats(requests) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const stats = {
    pending: 0,
    onLeave: 0,
    approvedThisMonth: 0,
    newRequest: 0,
    rejected: 0,
    returned: 0
  };

  requests.forEach(request => {
    // Count pending requests
    if (request.status.includes('PENDING')) {
      stats.pending++;
    }

    // Count employees currently on leave
    const startDate = new Date(request.start_date);
    const endDate = new Date(request.end_date);
    if (now >= startDate && now <= endDate && request.status === 'APPROVED') {
      stats.onLeave++;
    }

    // Count approved requests this month
    const createdDate = new Date(request.created_at);
    if (
      request.status === 'APPROVED' &&
      createdDate.getMonth() === currentMonth &&
      createdDate.getFullYear() === currentYear
    ) {
      stats.approvedThisMonth++;
    }

    // Count new requests (created in last 24 hours)
    const createdDate2 = new Date(request.created_at);
    if (createdDate2 >= oneDayAgo) {
      stats.newRequest++;
    }

    // Count rejected requests
    if (request.status === 'REJECTED') {
      stats.rejected++;
    }

    // Count returned requests
    if (request.status === 'RETURNED') {
      stats.returned++;
    }
  });

  return stats;
}
  
export default function HR() {
    const  stats=[]
    const [requests,setAllRequests]=useState([]);
    const [statsData,setStatsData]=useState({
      pending: 0,
      onLeave: 0,
      approvedThisMonth: 0,
      newRequest: 0,
      rejected: 0,
      returned: 0
    });
    const [loading, setLoading] = useState(false);

    async function fetchData() {
      const token = localStorage.getItem('token');
      
        try {
          setLoading(true);
          const response = await apiClient.get('/requests', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setAllRequests(response.data);
          const calculatedStats = calculateStats(response.data);
          setStatsData(calculatedStats);
          console.log('Fetched HR dashboard data:', response.data);
          console.log('Calculated stats:', calculatedStats);
        } catch (error) {
          console.log('Error fetching HR dashboard data:', error);
        } finally {
          setLoading(false);
        }
      }
      useEffect(() => {
        fetchData();
      }, []);
      console.log(requests)
    return (
        <div className="flex min-h-screen bg-[#e0e0e0] font-['Roboto:Medium',sans-serif] gap-4 flex-col md:flex-row">
    <Sidebar name = 'dashboard'/>
    
    <main className="flex-1 px-4 md:px-6 py-4 md:py-6 overflow-y-auto">
      <HeaderBar title="Welcome HR" />
            
      <section className="mt-6  rounded-2xl shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <StatsCard title="Pending Request" value={statsData.pending} variant="white" />
                    <StatsCard title="Currently on leave" value={statsData.onLeave} variant="gray" />
                    <StatsCard title="Approved this month" value={statsData.approvedThisMonth} variant="white" />
                    <StatsCard title="New Request" value={statsData.newRequest} variant="light-gray" />
                    <StatsCard title="Rejected" value={statsData.rejected} variant="gray" />
                    <StatsCard title="Returned" value={statsData.returned} variant="light-gray" />
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
