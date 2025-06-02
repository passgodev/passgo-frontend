import { Box, Button, Container, Divider, Paper, Stack, styled, Typography } from "@mui/material";
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberType from '../../model/member/MemberType.ts';
import WEB_ENDPOINTS from '../../util/endpoint/WebEndpoint.ts';
import ClientSignupCredentialComponent from './member/ClientSignupCredentialComponent.tsx';
import OrganizerSignupCredentialComponent from './member/OrganizerSignupCredentialComponent.tsx';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

const SignupPage = () => {
    const [activeMemberType, setActiveMemberType] = useState(MemberType.CLIENT);
    const navigate = useNavigate();

    let memberSubmitHandler: () => void;
    const populateSendSubmit = (memberHandleSubmitCallback: () => void) => {
        memberSubmitHandler = memberHandleSubmitCallback;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        memberSubmitHandler();
    }

    const createMemberTypeRegistrationButtons = (currentMember: MemberType) => {
        return Object.keys(MemberType)
            .filter(key => isNaN(Number(key)))
            .map((key, i) => {
                // @ts-expect-error  key is a string, but number is expected. Here we are using object's mechanism which is: obj["property"]
                const membrType = MemberType[key];
                const isActive = (membrType === currentMember);

                if ( membrType === MemberType.ADMINISTRATOR ) {
                    return;
                }

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
                    onSubmit={(e) => handleSubmit(e)}
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
                                navigate(WEB_ENDPOINTS.login);
                            }}>
                        Login
                    </Button>
                </Typography>
            </Paper>
        </Container>
    );
};

export default SignupPage;
