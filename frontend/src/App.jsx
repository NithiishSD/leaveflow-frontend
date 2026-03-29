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
      <Route path="/requests" element={<AuthController><RequestForm /></AuthController>} />
      <Route path="/edit-request/:id" element={<AuthController><RequestForm /></AuthController>} />
      <Route path="/manager/:id" element={<AuthController><ManagerDashboard /></AuthController>} />
      <Route path="/HR/:id" element={<AuthController><HR /></AuthController>} />
      <Route path="/employee/:id" element={<AuthController><Employee /></AuthController>} />

      <Route path="/" element={<Login/>} />
      <Route path = "/requests-received" element = {<AuthController><RequestHistory /></AuthController>}/>
    </Routes>
  );
}

export default App;

