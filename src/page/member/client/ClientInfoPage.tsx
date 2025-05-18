import { useParams } from 'react-router-dom';


const ClientInfoPage = () => {
    const params = useParams();

    console.log('client info page params', params);

    return (
        <div>ClientInfoPage</div>
    );
};
export default ClientInfoPage;
