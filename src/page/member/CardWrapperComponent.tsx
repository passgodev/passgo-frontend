import { Card, CardContent } from '@mui/material';
import { ReactElement } from 'react';

type ReactElementCard = ReactElement<typeof Card>

interface MemberPageProps {
    children: ReactElementCard | ReactElementCard[]
}

const CardWrapperComponent = ({children}: MemberPageProps) => {
    return (
        <Card sx={{ mt: 4, mb: 4, p: 1 }}>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
};
export default CardWrapperComponent;