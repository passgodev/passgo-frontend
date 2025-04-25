import { Alert, Snackbar } from '@mui/material';
import { createContext, ReactNode, useState } from 'react';

type AlertLevel = 'info';

interface IAlert {
    showAlert: (message: string, level: AlertLevel) => void
}

const AlertContext = createContext<IAlert>({
    showAlert: () => {}
})

interface AlertProviderProps {
    children: ReactNode;
}

export const AlertProvider = ({ children }: AlertProviderProps) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [level, setLevel] = useState<AlertLevel>('info');

    const showAlert = (message: string, level: AlertLevel) => {
        setMessage(message);
        setLevel(level);
        setOpen(true);
    }

    const hideAlert = () => {
        setOpen(false);
    }

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} open={open} autoHideDuration={3000} onClose={hideAlert}>
                <Alert onClose={hideAlert} severity={level} variant="filled" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </AlertContext.Provider>
    );
};

export default AlertContext;
