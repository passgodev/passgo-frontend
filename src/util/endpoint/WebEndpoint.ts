import { Endpoint } from "./Endpoint.ts";

const WEB_ENDPOINTS = {
    login: endpointCreator('/login'),
    signup: endpointCreator('/signup'),
    home: endpointCreator('/'),
    transaction: endpointCreator('/transaction'),
    unauthorized: endpointCreator('/unauthorized'),
    clientById: endpointCreator('/clients/:id'),
    activeMemberProfile: endpointCreator('/members/me'),
    faq: endpointCreator("/faq"),
    adminFaq: endpointCreator("/admin/faq"),
    adminClientList: endpointCreator('/admin/members/client'),
    adminOrganizerList: endpointCreator('/admin/members/organizer'),
    events: endpointCreator("/events"),
    addBuilding: endpointCreator('/building/add'),
    building: endpointCreator('/building')
}

function endpointCreator(endpoint: string): Endpoint {
    return endpoint;
}

export default WEB_ENDPOINTS;
