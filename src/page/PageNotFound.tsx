import { Box, Card, CssBaseline, Divider, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import WEB_ENDPOINTS from '../util/endpoint/WebEndpoint.ts';


const PageNotFound = () => {
    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{bgcolor: 'primary.main', width: '100vw', height: '100vh', m: 0, p: 0}}>
            <CssBaseline />
            <Card sx={{ p: 8 }}>
                <Typography color='primary' variant='h2'>
                    Passgo
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography align='center' variant='h5' noWrap>
                    Page Not Found
                </Typography>
                <Box display='flex' justifyContent={'center'}>
                    <Typography noWrap>
                        Return To {
                            <Typography component={Link} to={WEB_ENDPOINTS.home}>
                                Home Page
                            </Typography>
                        }
                    </Typography>
                </Box>
            </Card>
        </Box>
    );
};
export default PageNotFound;
