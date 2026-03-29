import React, { useState } from 'react'
import {useLeave} from '../components/LeaveContext.jsx'
import Sidebar from '../components/Sidebar.jsx'
import HeaderBar from '../components/HeaderBar.jsx'
import RequestDetailsModal from '../components/RequestDetailsModal.jsx'

export default function RequestHistory(){
    const {allRequests, handleAction, loading} = useLeave();
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [leaveTypeFilter, setLeaveTypeFilter] = useState('all');

    // Filter requests that need approval
    const requestsNeedingApproval = (allRequests || []).filter(req => 
        ['PENDING_MANAGER', 'PENDING_HR', 'RETURNED'].includes(req.status)
    );

    // Apply filters
    const filteredRequests = requestsNeedingApproval.filter(req => {
        const statusMatch = statusFilter === 'all' || req.status === statusFilter;
        const typeMatch = leaveTypeFilter === 'all' || req.type === leaveTypeFilter;
        return statusMatch && typeMatch;
    });

    const handleSelectRow = (id) => {
        const newSelected = new Set(selectedRows);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedRows(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedRows.size === filteredRequests.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(filteredRequests.map(r => r.id)));
        }
    };

    const handleMassApprove = async () => {
        for (const id of selectedRows) {
            await handleAction(id, 'approve');
        }
        setSelectedRows(new Set());
    };

    const handleMassDeny = async () => {
        if (window.confirm(`Deny ${selectedRows.size} request(s)?`)) {
            for (const id of selectedRows) {
                await handleAction(id, 'deny');
            }
            setSelectedRows(new Set());
        }
    };

    const handleMassReturn = async () => {
        if (window.confirm(`Return ${selectedRows.size} request(s) for fixes?`)) {
            for (const id of selectedRows) {
                await handleAction(id, 'return');
            }
            setSelectedRows(new Set());
        }
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const calculateDays = (start, end) => {
        const diffTime = Math.abs(new Date(end) - new Date(start));
        return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'PENDING_MANAGER': return 'text-yellow-600 bg-yellow-50';
            case 'PENDING_HR': return 'text-blue-600 bg-blue-50';
            case 'RETURNED': return 'text-orange-600 bg-orange-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getStatusLabel = (status) => {
        return status?.replace(/_/g, ' ') || 'Unknown';
    };

    return (
        <div className = "flex min-h-screen bg-[#e0e0e0] font-['Roboto:Medium',sans-serif] gap-4 flex-col md:flex-row">
            <Sidebar name = 'requests-received'/>
            <main className="flex-1 px-4 md:px-6 py-4 md:py-6 overflow-y-auto">
                <HeaderBar title="Leave Request History" />
                
                <section className="mt-6 bg-white rounded-2xl shadow-sm p-8 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800 tracking-[0.1px]">Requests Awaiting Approval ({filteredRequests.length})</h2>
                        
                        <div className="flex gap-4">
                            <div className="relative">
                                <select 
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-40 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-medium tracking-[0.1px] cursor-pointer"
                                >
                                    <option value="all">All Status</option>
                                    <option value="PENDING_MANAGER">Pending Manager</option>
                                    <option value="PENDING_HR">Pending HR</option>
                                    <option value="RETURNED">Returned</option>
                                </select>
                            </div>
                            
                            <div className="relative">
                                <select 
                                    value={leaveTypeFilter}
                                    onChange={(e) => setLeaveTypeFilter(e.target.value)}
                                    className="w-40 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-medium tracking-[0.1px] cursor-pointer"
                                >
                                    <option value="all">All Types</option>
                                    <option value="VACATION">Vacation</option>
                                    <option value="EMERGENCY">Emergency</option>
                                    <option value="SICK">Sick</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Mass Action Bar */}
                    {selectedRows.size > 0 && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                            <p className="text-sm font-medium text-blue-900 tracking-[0.1px]">
                                {selectedRows.size} request(s) selected
                            </p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={handleMassApprove}
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg text-xs transition-colors tracking-[0.1px]"
                                >
                                    Approve All
                                </button>
                                <button 
                                    onClick={handleMassDeny}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg text-xs transition-colors tracking-[0.1px]"
                                >
                                    Deny All
                                </button>
                                <button 
                                    onClick={handleMassReturn}
                                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg text-xs transition-colors tracking-[0.1px]"
                                >
                                    Return All
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-purple-50/50">
                                    <th className="px-4 py-4 text-sm font-bold text-gray-700 tracking-[0.1px]">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedRows.size === filteredRequests.length && filteredRequests.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700 tracking-[0.1px]">Employee</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700 tracking-[0.1px]">Leave Type</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700 tracking-[0.1px]">Dates Requested</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700 tracking-[0.1px]">Days</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700 tracking-[0.1px]">Reason</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700 tracking-[0.1px]">Submitted On</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700 tracking-[0.1px]">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-8 text-center text-gray-500 font-medium tracking-[0.1px]">
                                            No requests awaiting approval
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRequests.map((req) => (
                                        <tr key={req.id} className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                                                selectedRows.has(req.id) ? 'bg-blue-50' : ''
                                            }`} onClick={() => {
                                                setSelectedRequest(req);
                                                setIsDetailsOpen(true);}}>
                                            <td className="px-4 py-4 text-sm text-gray-600 font-medium tracking-[0.1px]" onClick={(e) => e.stopPropagation()}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedRows.has(req.id)}
                                                    onChange={() => handleSelectRow(req.id)}
                                                    className="w-5 h-5 cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-medium tracking-[0.1px]">
                                                {req.employee?.name || req.employee_id || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-medium tracking-[0.1px] capitalize">
                                                {req.type?.toLowerCase() || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-medium tracking-[0.1px]">
                                                {formatDate(req.start_date)} - {formatDate(req.end_date)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-medium tracking-[0.1px]">
                                                {calculateDays(req.start_date, req.end_date)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-medium tracking-[0.1px] max-w-xs truncate">
                                                {req.reason || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-medium tracking-[0.1px]">
                                                {formatDate(req.created_at)}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium tracking-[0.1px]">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(req.status)}`}>
                                                    {getStatusLabel(req.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Details Modal */}
                {selectedRequest && (
                    <RequestDetailsModal 
                        req={selectedRequest}
                        isOpen={isDetailsOpen}
                        onClose={() => setIsDetailsOpen(false)}
                        onApprove={(id) => {
                            handleAction(id, 'approve');
                            setIsDetailsOpen(false);
                        }}
                        onReject={(id) => {
                            handleAction(id, 'deny');
                            setIsDetailsOpen(false);
                        }}
                        onReturn={(id) => {
                            handleAction(id, 'return');
                            setIsDetailsOpen(false);
                        }}
                    />
                )}
            </main>
        </div>
    )
}