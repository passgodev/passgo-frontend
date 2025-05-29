import { Box, Card, Divider, Typography } from "@mui/material";
import ClientDto from "../../model/client/ClientDto";
import useInterceptedFetch from "../../hook/useInterceptedFetch";
import { useContext, useEffect, useState } from "react";
import API_ENDPOINTS from "../../util/endpoint/ApiEndpoint";
import AlertContext from "../../context/AlertProvider";

interface MemberInformationComponentProps {
    member: ClientDto;
}

interface SimpleTransactionDto {
    id: number;
    totalPrice: number;
    completedAt: string;
    transactionType: "PURCHASE" | "RETURN" | "TOP_UP";
}

const LatestTransactionsComponent = ({
    member,
}: MemberInformationComponentProps) => {
    const interceptedFetch = useInterceptedFetch();
    const [transactions, setTransactions] = useState<SimpleTransactionDto[]>(
        []
    );
    const { showAlert } = useContext(AlertContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const rawEndpoint =
                    API_ENDPOINTS.transactionsByClientId.toString();
                const finalEndpoint = rawEndpoint.replace(
                    ":id",
                    member.id.toString()
                );

                const response = await interceptedFetch({
                    endpoint: finalEndpoint,
                });

                if (!response.ok) {
                    showAlert("Error while fetching transactions.", "error");
                }

                const data: SimpleTransactionDto[] = await response.json();
                console.log("DEBUGER: ", data);
                setTransactions(data);
            } catch (err) {
                console.error(err);
                showAlert("Error while fetching transactions.", "error");
            } finally {
                setLoading(false);
            }
        };

        if (member?.id) {
            fetchTransactions();
        }
    }, [member.id]);

    if (loading) return <Typography>Loading transactions...</Typography>;

    return (
        <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Recent transactions
            </Typography>
            <Box>
                {transactions.length === 0 ? (
                    <Typography variant="body2">No transactions yet</Typography>
                ) : (
                    transactions.map((txn, index) => (
                        <>
                            <Divider sx={{ mb: 1 }} />
                            <Box
                                key={txn.id}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: index < transactions.length - 1 ? 1 : 0,
                                }}
                            >
                                <Typography variant="body2">
                                    Transaction ID: {txn.id}
                                </Typography>
                                <Typography variant="body2">
                                    {txn.totalPrice.toFixed(2)} zł
                                </Typography>
                                <Typography variant="body2">
                                    {new Date(txn.completedAt).toLocaleString(
                                        "pl-PL"
                                    )}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color={
                                        txn.transactionType === "RETURN"
                                            ? "error"
                                            : txn.transactionType === "TOP_UP"
                                            ? "success"
                                            : "primary"
                                    }
                                    sx={{ fontWeight: 600 }}
                                >
                                    {txn.transactionType === "RETURN"
                                        ? "Return"
                                        : txn.transactionType === "TOP_UP"
                                        ? "Top-up"
                                        : "Purchase"}
                                </Typography>
                            </Box>
                        </>
                    ))
                )}
            </Box>
        </Card>
    );
};
export default LatestTransactionsComponent;
