import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e1e26',
            color: '#fff',
            border: '1px solid rgba(217, 70, 239, 0.3)',
            boxShadow: '0 0 20px rgba(217, 70, 239, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#39ff14',
              secondary: '#1e1e26',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff0055',
              secondary: '#1e1e26',
            },
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>,
)
