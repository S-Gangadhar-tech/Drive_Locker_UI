// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import './index.css'
import { NotesProvider } from './context/NotesContext.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import { FileProvider } from './context/FileContext.jsx'
createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Router >
    <ToastContainer
      position="top-center"
      toastClassName="centered-toast"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <AppContextProvider>
      <NotesProvider>
        <FileProvider>
          < App />
        </FileProvider>
      </NotesProvider>
    </AppContextProvider>
    {/* </ToastContainer> */}
  </Router>
  // {/* </StrictMode>, */ }
)
