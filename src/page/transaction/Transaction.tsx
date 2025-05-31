import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationInitialState } from '@mui/x-data-grid';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AlertContext from '../../context/AlertProvider.tsx';
import useInterceptedFetch from '../../hook/useInterceptedFetch.ts';
import TransactionDto from '../../model/transaction/TransactionDto.ts';
import API_ENDPOINTS from '../../util/endpoint/ApiEndpoint.ts';
import WEB_ENDPOINTS from '../../util/endpoint/WebEndpoint.ts';
import { loggerPrelogWithFactory } from '../../util/logger/Logger.ts';
import { Paginated } from '../../util/pagination/Paginated.ts';


const columns: GridColDef<TransactionDto>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'totalPrice',
        headerName: 'Total price',
        width: 150,
    },
    {
        field: 'completedAt',
        headerName: 'Completed At',
        width: 150,
    },
    {
        field: 'client',
        headerName: 'Client',
        width: 150,
        renderCell: (cell) => {
            logger.log('transactions', cell.formattedValue);
            const {id, firstName, lastName} = cell.formattedValue;
            return <Typography component={Link} to={WEB_ENDPOINTS.clientById.replace(':id', id)}>
                {firstName + ' ' + lastName}
            </Typography>
        }
    },
];

const DEFAULT_TRANSACTIONS: TransactionDto[] = [];

const logger = loggerPrelogWithFactory('[TransactionPage]')


const Transaction = () => {
    const interceptedFetch = useInterceptedFetch();
    const [paginatedTransactions, setPaginatedTransactions] = useState<Paginated<TransactionDto>>();
    const [transactionError, setTransactionError] = useState('');
    const { showAlert } = useContext(AlertContext);

    useEffect(() => {
        interceptedFetch({ endpoint: API_ENDPOINTS.transactions })
            .then(response => response.json() as unknown as Paginated<TransactionDto>)
            .then(paginatedTransaction => {
                logger.log('Paginated Transaction', paginatedTransaction);
                showAlert('Ok', 'info');
                setPaginatedTransactions(paginatedTransaction);
            })
            .catch(err => {
                const errorMessage = `Trsansaction fetch error`;
                logger.log(errorMessage, err);
                showAlert(errorMessage, 'error');
                setTransactionError('Error Occured');
            })
    }, []);

    const transactions = paginatedTransactions?.content ?? DEFAULT_TRANSACTIONS;
    const pagination: GridPaginationInitialState = {
        paginationModel: {
            pageSize: paginatedTransactions?.pageable?.pageSize
        },
    }

    return (
        <Box sx={{p: 3, tableLayout: "fixed"}} width='100%' minWidth='60vw' display="table" >
            {
                transactionError !== ''
                    ? <Typography>Error</Typography>
                    : <DataGrid
                        rows={transactions}
                        columns={columns}
                        initialState={{
                            pagination
                        }}
                        pageSizeOptions={[1, 5, 10]}
                        checkboxSelection
                        disableRowSelectionOnClick
                    />
            }
        </Box>
    );
};
export default Transaction;
