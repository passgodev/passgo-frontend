import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { FormEvent, useContext, useEffect, useState } from "react";
import AlertContext from '../../context/AlertProvider.tsx';
import useAuth from '../../hook/useAuth.ts';
import ApiEndpoints from '../../util/endpoint/ApiEndpoint.ts';
import WebEndpoints from '../../util/endpoint/WebEndpoint.ts';
import HttpMethod from '../../util/HttpMethod.ts';
import { useNavigate, useLocation } from 'react-router-dom';


interface LoginResponse {
    token: string
}

const LoginPage = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        console.log("Form submitted", login, password);
        const response = await fetch(
            ApiEndpoints.login,
            {
                method: HttpMethod.POST,
                body: JSON.stringify({login, password}),
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            })
            .then(res => {
              if (res.status === 200) {
                  return res.text();
              } else {
                  console.log('unexpected responseCode: ', res);
              }
            }).then(text => {
                const jsonResponse = JSON.parse(text || "") as unknown as LoginResponse;
                const accessToken = jsonResponse?.token;
                const authObject = {token: accessToken};

                console.log('authenticated response: ', jsonResponse, authObject);

                setAuth(authObject);

                setLogin('');
                setPassword('');

                navigate(from, {replace: true});
            })
            .catch(err => console.log('err', err));
        console.log(response);
    };

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const { showAlert } = useContext(AlertContext);
    useEffect(() => {
        showAlert('test', 'info');
        console.log('hidden alert')

    }, [])

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
                        navigate(WebEndpoints.signup);
                    }}>
                        Signup
                    </Button>
                </Typography>
            </Paper>
        </Container>
    );
};

export default LoginPage;