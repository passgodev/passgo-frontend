import { TextField } from '@mui/material';


const OrganizerSignupCredentialComponent = () => {
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
                label="Organization Name"
                name="organizationName"
                type="organizationName"
            />
        </>
     );
};
export default OrganizerSignupCredentialComponent;
