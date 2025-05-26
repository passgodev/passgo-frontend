import { Endpoint } from "./Endpoint.ts";

const WEB_ENDPOINTS = {
    login: endpointCreator('/login'),
    signup: endpointCreator('/signup'),
    logout: endpointCreator('/logout'),
    home: endpointCreator('/'),
    transaction: endpointCreator('/transaction'),
    unauthorized: endpointCreator('/unauthorized'),
    clientById: endpointCreator('/clients/:id'),
    activeMemberProfile: endpointCreator('/members/me'),
    faq: endpointCreator("/faq"),
    adminFaq: endpointCreator("/admin/faq"),
    adminClientList: endpointCreator('/admin/members/client'),
    adminOrganizerList: endpointCreator('/admin/members/organizer'),
    adminOrganizersAcceptance: endpointCreator("/admin/members/organizer/acceptance"),
    events: endpointCreator("/events"),
    addBuilding: endpointCreator('/building/add'),
    building: endpointCreator('/building'),
    eventById: endpointCreator("/events/:id"),
    buyTickets: endpointCreator("/events/:id/buy"),
    purchaseTickets: endpointCreator("/api/tickets/purchase"),
    eventsManagement: endpointCreator("/events/management"),
    addEvent: endpointCreator("/events/add")
}

function endpointCreator(endpoint: string): Endpoint {
    return endpoint;
}

export default WEB_ENDPOINTS;
