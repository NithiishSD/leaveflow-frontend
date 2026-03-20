import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const LeaveContext = createContext();

export const LeaveProvider = ({ children }) => {
  const [allRequests, setAllRequests] = useState([
    {
      id: '1',
      employee_id: 'emp-1',
      employee: { id: 'emp-1', name: 'John Smith' },
      type: 'VACATION',
      start_date: '2026-04-01',
      end_date: '2026-04-05',
      reason: 'Family vacation',
      status: 'PENDING_MANAGER',
      created_at: '2026-03-19T10:00:00Z'
    },
    {
      id: '2',
      employee_id: 'emp-2',
      employee: { id: 'emp-2', name: 'Jane Doe' },
      type: 'EMERGENCY',
      start_date: '2026-03-20',
      end_date: '2026-03-21',
      reason: 'Medical emergency',
      status: 'PENDING_MANAGER',
      created_at: '2026-03-19T09:30:00Z'
    },
    {
      id: '3',
      employee_id: 'emp-3',
      employee: { id: 'emp-3', name: 'Mike Johnson' },
      type: 'VACATION',
      start_date: '2026-05-01',
      end_date: '2026-05-07',
      reason: 'Summer holidays',
      status: 'APPROVED',
      created_at: '2026-03-18T14:20:00Z'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const API_URL = '/api/requests';

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllRequests(res.data);
    } catch (err) {
      console.error("Fetch failed - using mock data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const stats = {
    total: allRequests.length,
    newRequests: allRequests.filter(r => r.status === 'PENDING_MANAGER').length,
    rejected: allRequests.filter(r => r.status === 'REJECTED').length,
    pending: allRequests.filter(r => r.status.includes('PENDING')).length,
  };

  const handleAction = async (id, type) => {
    const status = type === 'approve' ? 'APPROVED' : type === 'deny' ? 'REJECTED' : 'RETURNED';
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`${API_URL}/${id}/manager`, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchRequests();
    } catch (err) {
      console.error("Action failed:", err);
      setAllRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status } : req
      ));
    }
  };

  return (
    <LeaveContext.Provider value={{ 
      stats:{
        total: 10,
        newRequests,// allRequests.filter(r => r.status === 'PENDING_MANAGER').length,
        rejected:,//allRequests.filter(r => r.status === 'REJECTED').length,
        pending:,//allRequests.filter(r => r.status.includes('PENDING')).length,
      },
      requests:[],// allRequests.filter(r => r.status === 'PENDING_MANAGER'), 
      handleAction, 
      loading: false 
    }}>
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => {
 
  
  return useContext(LeaveContext);
};
