import { Box, Card, CssBaseline, Divider, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';


const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{bgcolor: 'primary.main', width: '100vw', height: '100vh', m: 0, p: 0}}>
            <CssBaseline />
            <Card sx={{ p: 8 }}>
                <Typography color='primary' variant='h2'>
                    Passgo
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography align='center' variant='h5' noWrap>
                    Unauthorized page
                </Typography>
                <Box display='flex' justifyContent={'center'}>
                    <Typography noWrap>
                        Return To {
                        <Typography component={Link} onClick={(e) => {
                            e.preventDefault();
                            navigate(-1)
                        }}>
                            previous page
                        </Typography>
                    }
                    </Typography>
                </Box>
            </Card>
        </Box>
    );
};
export default UnauthorizedPage;
