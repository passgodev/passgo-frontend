// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum WebEndpoint {
    LOGIN,
    SIGNUP,
    HOME
}

type Endpoint = string;

type Endpoints = {
    readonly [key in keyof typeof WebEndpoint as Lowercase<key>]: Endpoint;
}

const WebEndpoints: Endpoints = {
    login: endpointCreator('/login'),
    signup: endpointCreator('/signup'),
    home: endpointCreator('/')
}

function endpointCreator(endpoint: string): string {
    return endpoint;
}

export default WebEndpoints;