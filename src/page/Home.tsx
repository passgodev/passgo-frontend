import useInterceptedFetch from '../hook/useInterceptedFetch.ts';


const Home = () => {
    const intercFetch = useInterceptedFetch();

    return (
        <>
            <div>Home</div>
            <button onClick={() => intercFetch({
                endpoint: '/api/health',
                reqInit: {
                    method: 'GET',
            }})}>Health</button>
        </>
    );
};
export default Home;
