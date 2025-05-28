import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { FormEvent, useCallback, useContext, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import AlertContext from '../../context/AlertProvider.tsx';
import { Auth } from '../../context/AuthProvider.tsx';
import useAuth from '../../hook/useAuth.ts';
import { retrieveMemberId, transferMemberTypeToPrivilege } from '../../util/AccessTokenUtil.ts';
import API_ENDPOINTS from '../../util/endpoint/ApiEndpoint.ts';
import WEB_ENDPOINTS from '../../util/endpoint/WebEndpoint.ts';
import HttpMethod from '../../util/HttpMethod.ts';
import logger from '../../util/logger/Logger.ts';


interface LoginResponse {
    token: string,
    refreshToken: string
}

interface LoginErrorResponse {
    message: string
}

const parseLoginResponse = (text: string): LoginResponse | undefined => {
    try {
        return JSON.parse(text) as unknown as LoginResponse;
    } catch (e) {
        logger.log('Login Page', 'parseLoginResponse error', e);
        return undefined;
    }
}

const parseErrorMessage = (error: string): string => {
    try {
        const parsedError = JSON.parse(error) as unknown as LoginErrorResponse;
        return parsedError.message;
    } catch (e) {
        logger.log('Login Page', 'parseLoginErrorMessage error', e);
        return error;
    }
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

        logger.log("Form submitted", "login", login, "password", password);
        const response = await fetch(
            API_ENDPOINTS.login,
            {
                method: HttpMethod.POST,
                body: JSON.stringify({login, password}),
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            })
            .then(async (res) => {
                logger.log('login response', res);
                const text = await res.clone().text();

                if (res.status === 200) {
                    const jsonResponse = parseLoginResponse(text);
                    if ( jsonResponse === undefined ) {
                        showAlert('Login response is undefined', 'error');
                        return;
                    }

                    const {token: accessToken, refreshToken} = jsonResponse;
                    const privilege = transferMemberTypeToPrivilege(accessToken);
                    const memberId = retrieveMemberId(accessToken);
                    const authObject: Auth = {memberId, token: accessToken, refreshToken: refreshToken, privilege: privilege};
                    logger.log('response 200', 'authObject', authObject)

                    setAuth(authObject);
                    // todo change to http only cookies, do not store it locally
                    localStorage.setItem('passgoRT', refreshToken);

                    setLogin('');
                    setPassword('');

                    navigate(from, { replace: true });
                } else if ( res.status >= 400 && res.status < 599 ) {
                    const errMsg = (text.length  !== 0) ? parseErrorMessage(text) : (res.status + ' ' + res.statusText);
                    logger.log('loginPage', 'got res.status between 400 and 599', errMsg);
                    showAlert(errMsg, 'error')
                } else {
                    const errorMessage = `Unexpected response code: ${res.status}`;
                    logger.log('loginPage', errorMessage, 'failed response: ', res);
                    showAlert(errorMessage, 'error');
                }
            })
            .catch(err => {
                const errorMessage = `Error occured while logging in. ${err}`;
                logger.log('loginPage', errorMessage);
                showAlert(errorMessage, 'error');
            });
        logger.log('loginPage', 'proceed response', response);
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