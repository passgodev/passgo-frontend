import { Avatar, Card, Divider, Grid, Typography } from "@mui/material";
import ClientDto from "../../model/client/ClientDto.ts";

interface MemberInformationComponentProps {
    member: ClientDto;
}

const MemberInformationComponent = ({
    member,
}: MemberInformationComponentProps) => {
    return (
        <Card sx={{ mb: 2, p: 2 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid>
                    <Avatar sx={{ width: 100, height: 100 }} />
                </Grid>
                <Divider orientation="vertical" flexItem variant="middle" />
                <Grid>
                    <Typography variant="h5">{`${member.firstName} ${member.lastName}`}</Typography>
                    <Typography variant="body2">Role: {member.role.toLowerCase()}</Typography>
                    <Typography
                        variant="body2"
                        style={{ color: member.isActive ? "green" : "red" }}
                        sx={{ fontWeight: 600 }}
                    >
                        {member.isActive
                            ? "Active account"
                            : "Inactive account"}
                    </Typography>
                    <Typography variant="body2">
                        Adres: {member.email}
                    </Typography>
                </Grid>
            </Grid>
        </Card>
    );
};
export default MemberInformationComponent;
