import { Endpoint } from "./Endpoint.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum WebEndpoint {
    LOGIN,
    SIGNUP,
    HOME,
    FAQ,
    EVENTS,
}

type Endpoints = {
    readonly [key in keyof typeof WebEndpoint as Lowercase<key>]: Endpoint;
};

const WebEndpoints: Endpoints = {
    login: endpointCreator("/login"),
    signup: endpointCreator("/signup"),
    home: endpointCreator("/"),
    faq: endpointCreator("/faq"),
    events: endpointCreator("/events"),
};

function endpointCreator(endpoint: string): string {
    return endpoint;
}

export default WebEndpoints;
