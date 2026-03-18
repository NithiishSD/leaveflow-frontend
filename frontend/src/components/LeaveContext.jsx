import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const LeaveContext = createContext();

export const LeaveProvider = ({ children }) => {
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:3000/requests';

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllRequests(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
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
    const status = type === 'approve' ? 'APPROVED' : 'REJECTED';
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`${API_URL}/${id}/manager`, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchRequests();
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  return (
    <LeaveContext.Provider value={{ 
      stats, 
      requests: allRequests.filter(r => r.status === 'PENDING_MANAGER'), 
      handleAction, 
      loading 
    }}>
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (!context) throw new Error("useLeave must be used within LeaveProvider");
  return context;
};