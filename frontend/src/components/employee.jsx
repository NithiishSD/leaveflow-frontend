import { useEffect, useState,useNavigate } from "react";
import Sidebar from "./Sidebar.jsx";

import HeaderBar from "./HeaderBar.jsx";
import RequestCard from "./RequestCard.jsx";

import axios from "axios";
import LeaveStatCard from "./LeaveStatCard.jsx";
import { useAuth } from "./auth.jsx";
import { useParams } from "react-router-dom";
import RequestDetailsModal from "./RequestDetailsModal.jsx"
const CURRENT_EMPLOYEE = {
  id: "EMP001",
  name: "ALexa Emp",
  initials: "emp",
  color: "#ef4444",
};
const INITIAL_MY_REQUESTS = [
  { reqId: "REQ001", type: "Annual Leave",       start: "2026-01-06", end: "2026-01-10", days: 5,  status: "approved", reason: "Family vacation"         },
  { reqId: "REQ002", type: "Sick Leave",         start: "2026-01-20", end: "2026-01-21", days: 2,  status: "approved", reason: "Fever & rest"             },
  { reqId: "REQ003", type: "Casual Leave",       start: "2026-02-14", end: "2026-02-14", days: 1,  status: "rejected", reason: "Personal errand"          },
  { reqId: "REQ004", type: "Annual Leave",       start: "2026-02-25", end: "2026-03-01", days: 5,  status: "approved", reason: "Travel"                   },
  { reqId: "REQ005", type: "Sick Leave",         start: "2026-03-05", end: "2026-03-05", days: 1,  status: "returned", reason: "Medical appointment"      },
  { reqId: "REQ006", type: "Casual Leave",       start: "2026-03-18", end: "2026-03-19", days: 2,  status: "pending",  reason: "Home renovation"          },
  { reqId: "REQ007", type: "Annual Leave",       start: "2026-04-10", end: "2026-04-15", days: 6,  status: "pending",  reason: "Vacation"                 },
  { reqId: "REQ008", type: "Maternity Leave",    start: "2026-05-01", end: "2026-07-29", days: 90, status: "pending",  reason: "Maternity"                },
  { reqId: "REQ009", type: "Sick Leave",         start: "2026-01-12", end: "2026-01-12", days: 1,  status: "approved", reason: "Doctor visit"             },
  { reqId: "REQ010", type: "Casual Leave",       start: "2026-02-03", end: "2026-02-03", days: 1,  status: "approved", reason: "Personal work"            },
  { reqId: "REQ011", type: "Annual Leave",       start: "2026-03-28", end: "2026-03-29", days: 2,  status: "rejected", reason: "Weekend extension"        },
  { reqId: "REQ012", type: "Compensatory Leave", start: "2026-04-22", end: "2026-04-22", days: 1,  status: "returned", reason: "Comp off for extra work"  },
];
 

function StatsCard({ title, value, variant = 'white' }) {
    const bgColor = {
      'white': 'bg-[#fefefe]',
      'gray': 'bg-[#c9c9c9]',
      'light-gray': 'bg-[#f6f6f6]'
    }[variant];
  
    return (
      <div className={`${bgColor} rounded-md md:rounded-[22px] p-7    shadow-sm flex flex-col items-center justify-center h-[80px]`}>
        <h3 className="text-md   text-black font-medium text-center ">
          {title}
        </h3>
        <p className="text-2xl md:text-3xl text-black font-bold tracking-[0.1px]">
          {value}
        </p>
      </div>
    );
  }
  function ActivityTracker({
     requests,setRequests,
    search, setSearch,
    statusFilter, setStatusFilter,
    page, setPage,color 
  }) {
    const [requestmodel,setrequestmodel]=useState(false);
    const PAGE_SIZE = 8;
    const navigate=useNavigate();
   
    const {user}=useAuth();;
    // Stat counts derived from live requests
    // const total    = requests.length;
    // const approved = requests.filter(r => r.status === "approved").length;
    // const pending  = requests.filter(r => r.status === "pending").length;
    // const rejected = requests.filter(r => r.status === "rejected").length;
    // const returned = requests.filter(r => r.status === "returned").length;
    // Filter
    const filtered = requests.filter(r =>
      r.type.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "" || r.status === statusFilter)
    );
   
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage   = Math.min(page, totalPages);
    const slice      = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
   
    function handleDelete(reqId) {
      if (window.confirm("Remove this leave request?")) {
        setRequests(prev => prev.filter(r => r.reqId !== reqId));
        setPage(1);
      }
    }
   function seedetails(reqId){
    // Implement view details logic (e.g., open modal with request info)
    setrequestmodel(prev=>!prev)
   
  }
   function editrequest(reqid,status){
    if(status === "pending"){
      // Implement edit logic (e.g., navigate to edit form)
      setrequestmodel(false);
      navigate(`/edit-request/${reqid}`);
    } 
  }
    return (
      <div className="mt-20">
        
        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
   
          {/* Table Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-gray-900">My Leave Requests</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                All requests submitted by{" "}
                <span className="font-semibold text-gray-600">{user}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Icon.Search />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search for Leave Type"
                  className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors w-52"
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="returned">Returned</option>
              </select>
              <button
                onClick={() => { setSearch(""); setStatusFilter(""); setPage(1); }}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setPage(1)}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
   
          {/* Table Body */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["#", "Leave Type", "From", "To", "Days", "Reason", "Status", "Actions"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slice.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-gray-400 text-sm">
                      No leave requests match your filters.
                    </td>
                  </tr>
                ) : slice.map((r, idx) => (
                  <tr key={r.reqId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-xs text-gray-400 font-mono">
                      {(safePage - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-800">{r.type}</td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-gray-600">{fmtDate(r.start)}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-gray-600">{fmtDate(r.end)}</span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-700">{r.days}d</td>
                    <td className="px-5 py-3 text-gray-500 text-xs max-w-40 truncate">{r.reason}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[r.status]}`}>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1.5">
                        <button
                          title="View"
                          onClick={() =>seedetails(r.id)}//check the function 
                          className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center"
                        >
                          <Icon.Eye />
                        </button>
                        <button
                          title={r.status !== "pending" ? "Only pending requests can be edited" : "Edit"}
                          onClick={() => {editrequest(r.id)}}//check the function
                          className={`w-7 h-7 rounded-lg bg-gray-100 text-gray-500 transition-colors flex items-center justify-center ${r.status === "pending" ? "hover:bg-blue-600 hover:text-white" : "opacity-30 cursor-not-allowed"}`}
                        >
                          <Icon.Edit />
                        </button>
                        <button
                          title={r.status !== "pending" ? "Only pending requests can be deleted" : "Delete"}
                          onClick={() => r.status === "pending" && handleDelete(r.reqId)}
                          className={`w-7 h-7 rounded-lg bg-gray-100 text-gray-500 transition-colors flex items-center justify-center ${r.status === "pending" ? "hover:bg-red-500 hover:text-white" : "opacity-30 cursor-not-allowed"}`}
                        >
                          <Icon.Trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
   
          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {filtered.length === 0
                ? "No entries"
                : `Showing ${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} of ${filtered.length} entries`}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <Icon.ChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg border text-xs font-medium transition-colors ${
                    safePage === p
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <Icon.ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const Icon = {
    Grid: () => (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    Mail: () => (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    ),
    Calendar: () => (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
    Search: () => (
      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg>
    ),
    Eye: () => (
      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    Edit: () => (
      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    Trash: () => (
      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
      </svg>
    ),
    Menu: () => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    ),
    Close: () => (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    ),
    ChevronLeft: () => (
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    ),
    ChevronRight: () => (
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    ),
  };
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function fmtDate(d) {
  const [, m, day] = d.split("-");
  return `${day} ${MONTHS[+m - 1]}`;
}
 
const STATUS_STYLES = {
  approved: "bg-emerald-50 text-emerald-700",
  pending:  "bg-amber-50 text-amber-700",
  rejected: "bg-red-50 text-red-600",
  returned: "bg-purple-50 text-purple-700",
};
 
export default function Employee() {
    const id=useParams().id;
    const [activeTab, setActiveTab] = useState('activity');
    const [request, setRequests]= useState(INITIAL_MY_REQUESTS);//changes has to be done here 
    const [search,setSearch]= useState("");
    const [statusFilter, setStatusFilter]= useState("");
    const [page,setPage] = useState(1);

    const fetchRequests = async () => {
      try{
        
      
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/employee/${id}`, {//check the api and give correct endpoint
        headers: { Authorization: `Bearer ${token}` }
      });

          setRequests(res.data);
        }catch(err){
          console.error("Fetch failed ", err);
          setRequests([]);
        }
      };

    useEffect(() => {
      fetchRequests();
      
    }, [id]);

    return (
      <div className="flex min-h-screen bg-[#e0e0e0] font-sans gap-4 flex-col md:flex-row">
        <Sidebar name='dashboard' />
        <main className="flex-1 bg-[#e0e0e0] shadow-sm px-10 py-4 md:px-12 overflow-y-auto gap-3">
          <HeaderBar title="Welcome employee" />
          
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
            <br />
            <div>
            {activeTab === 'activity' && (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatsCard title="Total" value="0" variant="white" />
              <StatsCard title="Rejected" value="10" variant="gray" />
              <StatsCard title="Pending Request" value="50" variant="white" />
              <StatsCard title="Approved this month" value="20" variant="light-gray" />
              <StatsCard title="Returned" value="10" variant="gray" />
              </div>
            )}
            {activeTab === 'summary' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <LeaveStatCard title="Annual Leave" total={21} used={8} color="white" />
                <LeaveStatCard title="Sick Leave" total={10} used={2} color="gray" />
                <LeaveStatCard title="Casual Leave" total={7} used={1} color="white" />
                <LeaveStatCard title="Maternity Leave" total={180} used={0} color="light-gray" />
                <LeaveStatCard title="Paternity Leave" total={15} used={0} color="gray" />
                <LeaveStatCard title="Compensatory Leave" total={5} used={0} color="white" />
              </div>
            )}
            </div>
            <div >
            <ActivityTracker
              requests={request}
              setRequests={setRequests}
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              page={page}
              setPage={setPage}
            />
          </div>
          <div>
            <RequestDetailsModal/>
          </div>
        </main>
      </div>
    );
  }
