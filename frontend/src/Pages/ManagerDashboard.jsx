import React from 'react';
import { useLeave } from '../components/LeaveContext';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import RequestCard from '../components/RequestCard';

const ManagerDashboard = () => {
  const { stats, requests, loading } = useLeave();

  return (
    <div className="flex min-h-screen bg-[#f0f0f0] font-sans">
      <Sidebar />
      
      <main className="flex-1 bg-white md:rounded-tl-[30px] shadow-sm p-10 md:p-12 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome, Manager</h1>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900">Leave Requests</h2>
          <p className="text-sm text-gray-500 mb-6">March 7, 2026</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard title="Total Requests" count={stats.total} shadowColor="#4b5563" />
            <StatCard title="New Requests" count={stats.newRequests} shadowColor="#22c55e" />
            <StatCard title="Rejected" count={stats.rejected} shadowColor="#ef4444" />
            <StatCard title="Pending requests" count={stats.pending} shadowColor="#eab308" />
          </div>
        </section>

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
};

export default ManagerDashboard;