import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AuthProvider from './components/auth.jsx'
import { LeaveProvider } from './components/LeaveContext.jsx'

createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <AuthProvider>
        <LeaveProvider>
          <App />
        </LeaveProvider>
      </AuthProvider>
    </BrowserRouter>
  
)
