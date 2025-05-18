import Privilege from '../model/member/Privilege.ts';


const parsePayloadAsJson = (accessToken: string) => {
    if ( accessToken.split('.').length - 1 !== 2 ) {
        console.log('transferMemberTypeToPrivilege : invalid jwt representation, two dots expected');
    }
    const payload = accessToken.split('.')[1];
    const decodedPayload = atob(payload);
    const payloadJson = JSON.parse(decodedPayload);
    console.log('decodePayloadAsJson - decoded payload', decodedPayload);
    return payloadJson;
}

const transferMemberTypeToPrivilege = (accessToken: string): Privilege => {
    const payloadJson = parsePayloadAsJson(accessToken)
    const memberType = payloadJson?.memberType;
    if ( memberType === undefined ) {
        console.log('transferMemberTypeToPrivilege : memberType is undefined');
    }
    const privilege = Privilege[memberType as keyof typeof Privilege];
    if ( privilege === undefined ) {
        console.log('transferMemberTypeToPrivilege : privilege is undefined');
    }
    console.log(`transferMemberTypeToPrivilege - privielege is ${privilege}`);
    return privilege;
}

const retrieveMemberId = (accessToken: string): string => {
    const payloadJson = parsePayloadAsJson(accessToken);
    const memberId = payloadJson?.memberId;
    if ( memberId === undefined ) {
        console.log('transferMemberTypeToPrivilege : memberType is undefined');
    }
    console.log(`transferMemberTypeToPrivilege : memberId is ${memberId}`);
    return memberId;
}

export { transferMemberTypeToPrivilege, retrieveMemberId };