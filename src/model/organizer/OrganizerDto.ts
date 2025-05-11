interface OrganizerDto {
    id: number
    firstName: string,
    lastName: string,
    email: string,
    registrationDate: Date,
    birthDate: Date,
    isActive: boolean,
    organizationName: string
}

export default OrganizerDto;