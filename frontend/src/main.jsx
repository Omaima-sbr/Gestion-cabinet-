import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { I18nProvider } from './i18n.jsx';
import { ThemeProvider } from './contexts/ThemeContext';
import "./components/Admin/pages/global.css";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider>
            <I18nProvider>
                <App />  {/* ← Utilise directement App qui contient BrowserRouter */}
            </I18nProvider>
        </ThemeProvider>
    </React.StrictMode>
);
