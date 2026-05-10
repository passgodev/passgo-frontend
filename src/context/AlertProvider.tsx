import { Alert, Snackbar } from '@mui/material';
import { createContext, ReactNode, useState } from 'react';

type AlertLevel = 'info' | 'error';

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
            <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                      open={open}
                      autoHideDuration={6000}
                      onClose={hideAlert}
                      slotProps={{clickAwayListener: { mouseEvent: false } }}>
                <Alert onClose={hideAlert} 
                       severity={level} 
                       sx={{ 
                         width: '100%',
                         fontSize: '1rem',
                         fontWeight: 600,
                         padding: '16px 24px',
                         '.MuiAlert-icon': {
                           fontSize: '1.8rem',
                           marginRight: '12px'
                         },
                         '.MuiAlert-message': {
                           display: 'flex',
                           alignItems: 'center'
                         }
                       }}>
                    {message}
                </Alert>
            </Snackbar>
        </AlertContext.Provider>
    );
};

export default AlertContext;
