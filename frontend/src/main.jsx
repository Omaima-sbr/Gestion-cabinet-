import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PatientsList from "./components/patient/ PatientList.jsx";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PatientsList />
  </StrictMode>,
)
