import { useState } from 'react';
import { useAuth } from './auth.jsx';
import { CalendarDaysIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login, setrole } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email or Employee ID is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    if (!role) {
      newErrors.role = 'Please select your role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email,
        password,
        role
      });
      const { token, username } = response.data;
      login(token, username);
      setrole(role);
      if(role === "HR"){
        navigate("/HR");
      } else if(role === "Employee"){
        navigate("/employee");
      } else if(role === "Manager"){
        navigate("/manager");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrors({ form: error.response.data.message });
      } else {
        setErrors({ form: 'Login failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-h-md max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
        <div className="text-center p-8 border-b border-gray-100">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl mb-6 shadow-lg">
            <CalendarDaysIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">LeaveFlow</h1>
          <p className="text-gray-600 font-medium">
            Leave requests made simple, secure, and transparent
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-3">
          {errors.form && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl animate-pulse">
              <p className="text-red-800 font-medium">{errors.form}</p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Email or Employee ID</label>
            <input
              type="text"
              placeholder="Enter your email or employee ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-2 font-medium">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-2 font-medium">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm hover:shadow-md appearance-none "
              required
            >
              <option value="">Select your role</option>
              <option value="HR">HR</option>
              <option value="Employee"> Employee</option>
              <option value="Manager"> Manager</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs mt-2 font-medium">{errors.role}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-all shadow-xl transform hover:-translate-y-1 group ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-linear-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                'Sign In →'
              )}
            </span>
          </button>
        </form>

        

        <div className="text-center text-xs text-gray-400 pb-6 px-2">
          © 2024 LeaveFlow. All rights reserved.
        </div>
      </div>
    </div>
  );
}

