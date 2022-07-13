export interface Address {
  street: string;
  postalCode: string;
  city: string;
}
export interface User {
  firstName: string;
  lastName: string;
  mobilePhone: string;
  email: string;
  civilStatus: string; // might not actually be a string...
  address: Address;
  personalNumber: string;
}

export interface PartnerInfo {
  partnerLastname: string;
  partnerName: string;
  partnerPersonalid: string;
  role?: string;
}
