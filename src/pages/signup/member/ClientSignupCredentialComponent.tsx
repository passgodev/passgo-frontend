import { TextField } from '@mui/material';


const ClientSignupCredentialComponent = () => {
    return (
        <>
            <TextField
                required
                fullWidth
                label="First Name"
                name="firstname"
                type="text"
            />
            <TextField
                required
                fullWidth
                label="Last Name"
                name="lastname"
                type="text"
            />
            <TextField
                required
                fullWidth
                label="Date of Birth"
                name="dateofBirth"
                type="date"
                slotProps={{inputLabel: { shrink: true }}}
            />
            <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
            />
        </>
    );
};
export default ClientSignupCredentialComponent;
