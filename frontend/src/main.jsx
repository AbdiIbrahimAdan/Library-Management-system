import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import { UserProvider } from './context/UserContext';
import { ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
      <UserProvider>
    <App />
    <ToastContainer position="top-right" autoClose={3000} />
    </UserProvider>,
  </React.StrictMode>,
 
)
