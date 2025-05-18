import { Box, Card, Divider, Typography } from '@mui/material';

interface LatestTransactionsComponentProps {
    transactions: { id: string, amount: string, date: string }[]
}

const LatestTransactionsComponent = ({ transactions }: LatestTransactionsComponentProps) => {
    return (
        <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Ostatnie transakcje
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Box>
                {transactions.map((txn, index) => (
                    <Box
                        key={txn.id}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: index < transactions.length - 1 ? 1 : 0,
                        }}
                    >
                        <Typography variant="body2">ID: {txn.id}</Typography>
                        <Typography variant="body2">{txn.amount}</Typography>
                        <Typography variant="body2">{txn.date}</Typography>
                    </Box>
                ))}
            </Box>
        </Card>
    );
};
export default LatestTransactionsComponent;
