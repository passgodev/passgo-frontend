import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AlertProvider } from './context/AlertProvider.tsx';
import { AuthProvider } from './context/AuthProvider.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AlertProvider>
                <AuthProvider>
                    <Routes>
                        <Route path="/*" element={<App />} />
                    </Routes>
                </AuthProvider>
            </AlertProvider>
        </BrowserRouter>
    </StrictMode>
)
