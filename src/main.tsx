import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AlertProvider } from './context/AlertProvider.tsx';
import { AuthProvider } from './context/AuthProvider.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AlertProvider>
                <AuthProvider>
                    {/* Wystarczy sam App, bez nadmiarowego routingu */}
                    <App />
                </AuthProvider>
            </AlertProvider>
        </BrowserRouter>
    </StrictMode>
)
