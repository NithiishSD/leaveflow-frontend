import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './components/login.jsx';
import HR from './components/hr.jsx';
import Employee from './components/employee.jsx';

import { useAuth } from './components/auth.jsx';
import RequestForm from './components/requestForm.jsx';
import ManagerDashboard from './Pages/ManagerDashboard.jsx';
import RequestHistory from './Pages//RequestHistory.jsx'

function AuthController({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/requests" element={<RequestForm />} />
      <Route path="/edit-request/:id" element={<RequestForm />} />
      <Route path="/manager" element={<ManagerDashboard />} />
      <Route path="/HR" element={<HR />} />
      <Route path="/employee" element={<Employee />} />
      
      <Route path="/" element={<Login/>} />
      <Route path = "/requests-received" element = {<RequestHistory/>}/>
    </Routes>
  );
}

export default App;

