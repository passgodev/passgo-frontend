import { Card, CardContent } from '@mui/material';
import { ReactElement } from 'react';


interface MemberPageProps {
    children: ReactElement<typeof Card>[]
}

const MemberCardWrapper = ({children}: MemberPageProps) => {
    return (
        <Card sx={{ mt: 4, p: 2 }}>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
};
export default MemberCardWrapper;
