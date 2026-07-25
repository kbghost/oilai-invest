import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-strong)',
              borderRadius: '14px',
              fontSize: '0.875rem',
              fontFamily: '"Poppins", sans-serif',
            },
            success: { iconTheme: { primary: '#22C55E', secondary: '#060B0F' } },
            error:   { iconTheme: { primary: '#FF5C7A', secondary: '#060B0F' } }
          }}
        />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)
