interface ClientDto {
    id: number
    firstName: string,
    lastName: string,
    email: string,
    registrationDate: Date
    birthDate: Date
    isActive: boolean
}

export default ClientDto;