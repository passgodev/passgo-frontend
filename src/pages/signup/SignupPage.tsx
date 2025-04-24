import { Box, Button, Container, Divider, Paper, Stack, styled, TextField, Typography } from "@mui/material";
import { useState } from 'react';
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

    const [activeMember, setActiveMember] = useState(MemberType.CLIENT);

    const handleSubmit = async () => {

    }

    const createMemberTypeRegistrations = () => {
        return Object.keys(MemberType)
            .filter(key => isNaN(Number(key)))
            .map((key, i) => {
                const membrType = MemberType[key];
                const isActive = (membrType === activeMember);

                return <Item key={i} onClick={() => setActiveMember(membrType)} sx={{backgroundColor: `${isActive ? 'primary.main' : 'white'}`, color: `${isActive ? 'white' : 'black'}`}}>{key}</Item>
            });
    }

    const memberCredentialComponent = (member: MemberType) => {
        switch (member) {
            case MemberType.CLIENT: {
                return <ClientSignupCredentialComponent />
            }
            case MemberType.ORGANIZER: {
                return <OrganizerSignupCredentialComponent />
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
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
            <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
                justifyContent="center"
            >
                {createMemberTypeRegistrations()}
            </Stack>
            {
                memberCredentialComponent(activeMember)
            }
              <TextField
                required
                fullWidth
                label="Login"
                name="login"
                type="text"
              />
              <TextField
                required
                fullWidth
                label="Password"
                name="password"
                type="password"
              />
            <Button type="submit" variant="contained" color="primary">
                Sign up
            </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignupPage;
