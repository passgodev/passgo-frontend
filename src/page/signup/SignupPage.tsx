import { Box, Button, Container, Divider, Paper, Stack, styled, Typography } from "@mui/material";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WebEndpoints from '../../util/endpoint/WebEndpoint.ts';
import WebEndpoint from '../../util/endpoint/WebEndpoint.ts';
import ClientSignupCredentialComponent from './member/ClientSignupCredentialComponent.tsx';
import OrganizerSignupCredentialComponent from './member/OrganizerSignupCredentialComponent.tsx';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

const SignupPage = () => {
    enum MemberType {
        CLIENT,
        ORGANIZER
    };

    const [activeMemberType, setActiveMemberType] = useState(MemberType.CLIENT);
    const navigate = useNavigate();

    let memberSubmitHandler: () => void;
    const populateSendSubmit = (memberHandleSubmitCallback: () => void) => {
        memberSubmitHandler = memberHandleSubmitCallback;
    }

    const handleSubmit = async () => {
        memberSubmitHandler();
    }

    const createMemberTypeRegistrationButtons = (currentMember: MemberType) => {
        return Object.keys(MemberType)
            .filter(key => isNaN(Number(key)))
            .map((key, i) => {
                const membrType = MemberType[key];
                const isActive = (membrType === currentMember);

                return <Item key={i} onClick={() => setActiveMemberType(membrType)} sx={{backgroundColor: `${isActive ? 'primary.main' : 'white'}`, color: `${isActive ? 'white' : 'black'}`}}>{key}</Item>
            });
    }

    const memberCredentialsComponent = (member: MemberType) => {
        switch (member) {
            case MemberType.CLIENT: {
                return <ClientSignupCredentialComponent handleSubmit={populateSendSubmit} />
            }
            case MemberType.ORGANIZER: {
                return <OrganizerSignupCredentialComponent handleSubmit={populateSendSubmit} />
            }
        }
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }} color="primary">
                <Typography variant="h4" component="h1" gutterBottom>
                    Sign Up
                </Typography>
                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    onSubmit={() => handleSubmit()}
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                    <Stack
                        direction="row"
                        divider={<Divider orientation="vertical" flexItem />}
                        spacing={2}
                        justifyContent="center"
                    >
                        {createMemberTypeRegistrationButtons(activeMemberType)}
                    </Stack>
                    {
                        memberCredentialsComponent(activeMemberType)
                    }
                    <Button type="submit" variant="contained" color="primary">
                        Sign up
                    </Button>
                </Box>
                <Typography>
                    Already have an account?
                    <Button variant="text" color="primary"
                            style={{backgroundColor: 'transparent'}}
                            onClick={() => {
                                navigate(WebEndpoints.login);
                            }}>
                        Login
                    </Button>
                </Typography>
            </Paper>
        </Container>
    );
};

export default SignupPage;
