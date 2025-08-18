// frontend/src/main.jsx (Updated)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx'; // Import AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider> {
            <React.StrictMode>
                <App />
            </React.StrictMode>
        }
            <App />
        </AuthProvider>
    </React.StrictMode>
);