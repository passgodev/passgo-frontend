import { Avatar, Card, Divider, Grid, Typography } from '@mui/material';

interface MemberInformation {
    avatar: string,
    firstName: string,
    lastName: string,
    role: string,
    age: number,
    address: string,
}

interface MemberInformationComponentProps {
    member: MemberInformation
}

const MemberInformationComponent = ({ member }: MemberInformationComponentProps) => {
    return (
        <Card sx={{ mb: 2, p: 2 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid>
                    <Avatar
                        src={member.avatar}
                        sx={{ width: 100, height: 100 }}
                    />
                </Grid>
                <Divider orientation="vertical" flexItem variant="middle" />
                <Grid>
                    <Typography variant="h5">{`${member.firstName} ${member.lastName}`}</Typography>
                    <Typography variant="body2">Rola: {member.role}</Typography>
                    <Typography variant="body2">Wiek: {member.age}</Typography>
                    <Typography variant="body2">Adres: {member.address}</Typography>
                </Grid>
            </Grid>
        </Card>
    );
};
export default MemberInformationComponent;
