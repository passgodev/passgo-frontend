import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { FormEvent, useCallback, useContext, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import AlertContext from '../../context/AlertProvider.tsx';
import { Auth } from '../../context/AuthProvider.tsx';
import useAuth from '../../hook/useAuth.ts';
import Privilege from '../../model/member/Privilege.ts';
import API_ENDPOINTS from '../../util/endpoint/ApiEndpoint.ts';
import WEB_ENDPOINTS from '../../util/endpoint/WebEndpoint.ts';
import HttpMethod from '../../util/HttpMethod.ts';


interface LoginResponse {
    token: string,
    refreshToken: string
}

const transferMemberTypeToPrivilege = (accessToken: string): Privilege => {
    if ( accessToken.indexOf('.') !== 2 ) {
        console.log('retrieveMemberType : invalid jwt representation, two dots expected');
    }
    const payload = accessToken.split('.')[1];
    const decodedPayload = atob(payload);
    const payloadJson = JSON.parse(decodedPayload);
    const memberType = payloadJson?.memberType ?? undefined;
    if ( memberType === undefined ) {
        console.log('retrieveMemberType : memberType is undefined');
    }
    const privilege = Privilege[memberType as keyof typeof Privilege];
    if ( privilege === undefined ) {
        console.log('retrieveMemberType : privilege is undefined');
    }
    return privilege;
}

const LoginPage = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const { showAlert } = useContext(AlertContext);
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleSubmit = useCallback(async (event: FormEvent) => {
        event.preventDefault();

        console.log("Form submitted", login, password);
        const response = await fetch(
            API_ENDPOINTS.login,
            {
                method: HttpMethod.POST,
                body: JSON.stringify({login, password}),
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            })
            .then(async (res) => {
                console.log(res);
                const text = await res.clone().text();

                if (res.status === 200) {
                    const jsonResponse = JSON.parse(text || "") as unknown as LoginResponse;
                    const accessToken = jsonResponse?.token;
                    const refreshToken = jsonResponse?.refreshToken;
                    const privilege = transferMemberTypeToPrivilege(accessToken);
                    const authObject: Auth = {token: accessToken, refreshToken: refreshToken, privilege: privilege};

                    console.log('authenticated response: ', jsonResponse, authObject);

                    setAuth(authObject);
                    // todo change to http only cookies, do not store it locally
                    localStorage.setItem('passgoRT', refreshToken);

                    setLogin('');
                    setPassword('');

                    navigate(from, {replace: true});
                } else if ( res.status >= 400 && res.status < 599 ) {
                    const errMsg = (text.length  !== 0) ? text : (res.status + ' ' + res.statusText);
                    showAlert(errMsg, 'error')
                } else {
                    console.log('unexpected responseCode: ', res);
                }
            })
            .catch(err => console.log('err', err));
        console.log(response);
    }, [from, login, navigate, password, setAuth, showAlert]);

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Login
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                    <TextField
                        onChange={(event) => setLogin(event.target.value)}
                        required
                        fullWidth
                        label="Login"
                        name="login"
                        type="text"
                    />
                    <TextField
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Log In
                    </Button>
                </Box>
                <Typography
                    marginTop={"20px"}
                >
                    Don't have an account?
                    <Button variant="text" color="primary"
                            style={{backgroundColor: 'transparent'}}
                            onClick={() => {
                                navigate(WEB_ENDPOINTS.signup);
                            }}>
                        Signup
                    </Button>
                </Typography>
            </Paper>
        </Container>
    );
};

export default LoginPage;