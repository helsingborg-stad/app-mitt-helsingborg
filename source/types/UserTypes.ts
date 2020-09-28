export interface User {
    firstName: string;
    lastName: string;
    mobilePhone: string;
    email: string;
    civilStatus: string; //might not actually be a string...
    address: Address;
}

export interface Address {
    street: string;
    postalCode: string;
    city: string;
}
