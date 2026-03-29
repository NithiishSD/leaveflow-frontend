import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api.js'; 
import { useAuth } from './auth.jsx';
const LeaveContext = createContext();

export const LeaveProvider = ({ children }) => {
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, role } = useAuth();
  const API_URL = '/requests';

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await apiClient.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllRequests(res.data || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch requests';
      setError(errorMessage);
      console.error("Fetch failed:", errorMessage);
      setAllRequests([]);
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
    const endpoint = role === 'HR' ? `${API_URL}/${id}/hr` : `${API_URL}/${id}/manager`;
    
    try {
      await apiClient.patch(endpoint, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchRequests();
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Action failed';
      setError(errorMessage);
      console.error("Action failed:", errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return (
    <LeaveContext.Provider value={{ 
      stats:{
        total: allRequests.length,
        newRequests: allRequests.filter(r => r.status === 'PENDING_MANAGER').length,
        rejected: allRequests.filter(r => r.status === 'REJECTED').length,
        pending: allRequests.filter(r => r.status.includes('PENDING')).length,
      },
      requests: allRequests.filter(r => r.status === 'PENDING_MANAGER'),
      allRequests: allRequests,
      handleAction, 
      loading: loading,
      error: error,
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
