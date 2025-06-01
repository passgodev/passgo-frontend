import {
    Avatar,
    Box,
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    TextField,
    Typography
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import AlertContext from '../../context/AlertProvider.tsx';
import useInterceptedFetch from "../../hook/useInterceptedFetch.ts";
import ClientDto from "../../model/client/ClientDto.ts";
import Privilege from '../../model/member/Privilege.ts';
import API_ENDPOINTS from "../../util/endpoint/ApiEndpoint.ts";
import { loggerPrelogWithFactory } from '../../util/logger/Logger.ts';
import EnableOnRole from '../EnableOnRole.tsx';


interface MemberInformationComponentProps {
    member: ClientDto;
}

const logger = loggerPrelogWithFactory('[memberInformationComponent]')


const MemberInformationComponent = ({
    member,
}: MemberInformationComponentProps) => {
    const [walletBalance, setWalletBalance] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState("");
    const interceptedFetch = useInterceptedFetch();
    const { showAlert } = useContext(AlertContext);

    const fetchWallet = async () => {
        const endpoint = API_ENDPOINTS.wallet.replace(
            ":id",
            member.id.toString()
        );

        try {
            const res = await interceptedFetch({
                endpoint: endpoint,
                reqInit: {
                    method: "GET",
                },
            });

            if ( res.status == 200 ) {
                const data = await res.json();
                setWalletBalance(data.money);
            } else if ( res.status === 403 ) {
                setWalletBalance(null);
                logger.log('Not enough permissions', res)
                showAlert('Not enough permissions', 'error');
            } else {
                setWalletBalance(null);
                logger.log('Could not load wallet amount', res)
                showAlert('Could not load wallet amount', 'error');
            }
        } catch (error) {
            console.error("Błąd pobierania portfela:", error);
        }
    };

    useEffect(() => {
        if (!member?.id) return;
        fetchWallet();
    }, [member?.id]);

    const handleTopUp = async () => {
        const endpoint = API_ENDPOINTS.addMoney.replace(
            ":id",
            member.id.toString()
        );

        const amount = parseFloat(topUpAmount);

        if (isNaN(amount) || amount <= 0) {
            showAlert('Amount should be positive number', 'error');
            return;
        }

        try {
            const res = await interceptedFetch({
                endpoint: endpoint,
                reqInit: {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: amount,
                        description: "Top-up via panel",
                    }),
                },
            });
            const updated = await res.json();
            setWalletBalance(updated.money);
            setDialogOpen(false);
            setTopUpAmount("");
        } catch (error) {
            console.error("Błąd doładowania portfela:", error);
        }
    };

    return (
        <>
            <Card
                sx={{
                    mb: 2,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ width: 100, height: 100, mr: 2 }} />
                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                    <Box>
                        <Typography variant="h5">{`${member.firstName} ${member.lastName}`}</Typography>
                        <Typography variant="body2">
                            Role: {member.role.toLowerCase()}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                color: member.isActive ? "green" : "red",
                            }}
                        >
                            {member.isActive
                                ? "Active account"
                                : "Inactive account"}
                        </Typography>
                        <Typography variant="body2">
                            Adres: {member.email}
                        </Typography>
                    </Box>
                </Box>

                <EnableOnRole allowedRoles={[Privilege.CLIENT, Privilege.ADMINISTRATOR]} >
                    <Box sx={{ textAlign: "right" }}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 1, fontSize: "1.2rem" }}
                        >
                            Wallet balance:{" "}
                            {typeof walletBalance === "number" ? (
                                <Box component="span" sx={{ fontWeight: 700 }}>
                                    {walletBalance.toFixed(2)} zł
                                </Box>
                            ) : (
                                "Loading..."
                            )}
                        </Typography>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setDialogOpen(true)}
                        >
                            Add funds
                        </Button>
                    </Box>
                </EnableOnRole>
            </Card>

            {/* Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Add funds</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Amount (PLN)"
                        type="number"
                        fullWidth
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleTopUp}
                        variant="contained"
                        color="primary"
                    >
                        Deposit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
export default MemberInformationComponent;
