import { Endpoint } from "./Endpoint.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum WebEndpoint {
  LOGIN,
  SIGNUP,
  HOME,
  FAQ,
}

type Endpoints = {
  readonly [key in keyof typeof WebEndpoint as Lowercase<key>]: Endpoint;
};

const WebEndpoints: Endpoints = {
  login: endpointCreator("/login"),
  signup: endpointCreator("/signup"),
  home: endpointCreator("/"),
  faq: endpointCreator("/faq"),
};

function endpointCreator(endpoint: string): string {
  return endpoint;
}

export default WebEndpoints;
