import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api.js'; 
import { useAuth } from './auth.jsx';
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
      created_at: '2026-03-19T10:00:00Z',
      approval_events: [],
      manager_id: null
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
      created_at: '2026-03-19T09:30:00Z',
      approval_events: [],
      manager_id: null
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
      created_at: '2026-03-18T14:20:00Z',
      approval_events: [
        {
          id: 'event-1',
          request_id: '3',
          actor_id: 'mgr-1',
          actor: { id: 'mgr-1', name: 'Sarah Wilson', role: 'MANAGER' },
          decision: 'APPROVED',
          comment: 'Approved as per schedule',
          created_at: '2026-03-18T15:00:00Z'
        }
      ],
      manager_id: 'mgr-1'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const { user,role } = useAuth();
  const API_URL = '/requests';

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await apiClient.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllRequests(res.data);
    } catch (err) {
      console.error("Fetch failed :", err);
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
    
  };
  if(role === "HR"){
    stats.pending = allRequests.filter(r => r.status===('PENDING_HR')).length;
  } else if(role === "MANAGER"){
    stats.pending = allRequests.filter(r => r.status === 'PENDING_MANAGER').length;
  }
  const handleAction = async (id, type) => {
    const status = type === 'approve' ? 'APPROVED' : type === 'deny' ? 'REJECTED' : 'RETURNED';
    const token = localStorage.getItem('token');
    try {
      await apiClient.patch(`${API_URL}/${id}/manager`, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchRequests();
    } catch (err) {
      console.error("Action failed:", err);
      setAllRequests(prev => prev.map(req => {
        if (req.id === id) {
          const latestEvent = req.approval_events?.[req.approval_events.length - 1];
          const manager_id = latestEvent?.actor_id || null;
          return { ...req, status, manager_id };
        }
        return req;
      }));
    }
  };

  return (
    <LeaveContext.Provider value={{ 
      stats:{
        total: allRequests.length,
        newRequests:allRequests.filter(r => r.status === 'PENDING_MANAGER').length,
        rejected:allRequests.filter(r => r.status === 'REJECTED').length,
        pending:allRequests.filter(r => r.status.includes('PENDING')).length,
      },
      requests: allRequests.filter(r => r.status === 'PENDING_MANAGER'),
      allRequests: allRequests,
      handleAction, 
      loading: false,
      getRequestDetails: (id) => allRequests.find(r => r.id === id),
      getManagerInfo: (managerId) => {
        for (const req of allRequests) {
          const event = req.approval_events?.find(e => e.actor_id === managerId);
          if (event?.actor) return event.actor;
        }
        return null;
      }
    }}>
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => {
 
  
  return useContext(LeaveContext);
};
