import { TextField } from '@mui/material';
import { useState } from 'react';
import ApiEndpoints from '../../../util/endpoint/ApiEndpoint.ts';
import HttpMethod from '../../../util/HttpMethod.ts';


const OrganizerSignupCredentialComponent = (props: {handleSubmit: (func: () => void) => void}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [organizationName, setOrganizationName] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const signupBody = {
        credentials: {
            login: login,
            password: password,
            email: email
        },
        firstName: firstName,
        lastName: lastName,
        birthDate: birthDate,
        organization: organizationName
    }
    console.log('signupbody', signupBody);

    const handleSubmit = async () => {

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');


        await fetch(
            `${ApiEndpoints.signup}?member=organizer`,
            {
                method: HttpMethod.POST,
                body: JSON.stringify(signupBody),
                headers: headers
            }
        );
    }

    props.handleSubmit(() => handleSubmit());

    return (
            <>
                <TextField
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    fullWidth
                    label="First Name"
                    name="firstname"
                    type="text"
                />
                <TextField
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    fullWidth
                    label="Last Name"
                    name="lastname"
                    type="text"
                />
                <TextField
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    type="text"
                />
                <TextField
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                    fullWidth
                    label="Date of Birth"
                    name="dateofBirth"
                    type="date"
                    slotProps={{inputLabel: { shrink: true }}}
                />
                <TextField
                    onChange={e => setOrganizationName(e.target.value)}
                    required
                    fullWidth
                    label="Organization Name"
                    name="organizationName"
                    type="organizationName"
                />
                <TextField
                    onChange={(e) => setLogin(e.target.value)}
                    required
                    fullWidth
                    label="Login"
                    name="login"
                    type="text"
                />
                <TextField
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                />
            </>
     );
};
export default OrganizerSignupCredentialComponent;
