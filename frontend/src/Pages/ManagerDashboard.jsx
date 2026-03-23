import React from 'react';
import { useLeave } from '../components/LeaveContext';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import RequestCard from '../components/RequestCard';
import HeaderBar from '../components/HeaderBar'

const ManagerDashboard = () => {
  const { stats, requests, loading } = useLeave();

  return (
    <div className="flex min-h-screen bg-[#e0e0e0] font-['Roboto:Medium',sans-serif] gap-4 flex-col md:flex-row">
      <Sidebar name = 'dashboard'/>
      
      <main className="flex-1 px-4 md:px-6 py-4 md:py-6 overflow-y-auto">
        <HeaderBar/>

        <section className="mt-6 bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 tracking-[0.1px] mb-2">Leave Requests</h2>
          <p className="text-sm text-gray-500 mb-6 font-medium tracking-[0.1px]">March 7, 2026</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard title="Total Requests" count={stats.total} shadowColor="#4b5563" />
            <StatCard title="New Requests" count={stats.newRequests} shadowColor="#22c55e" />
            <StatCard title="Rejected" count={stats.rejected} shadowColor="#ef4444" />
            <StatCard title="Pending requests" count={stats.pending} shadowColor="#eab308" />
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
};

export default ManagerDashboard;
