import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { I18nProvider } from './i18n.jsx';
import { ThemeProvider } from './contexts/ThemeContext';
import './pages/global.css';
import Router from './Router';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider>
            <I18nProvider>
                <Router />
            </I18nProvider>
        </ThemeProvider>
    </React.StrictMode>
);