import { User, Address } from '../../types/UserTypes';

export interface DecentralizedIdentifier {
  id: string;
  authenticationMethods: string[];
  created: string;
  updated: string;
  document: {
    '@id': string;
    [x: string]: any;
  }[];
}
interface ContactInfo {
  email: string;
  phone: string;
}
interface PersonalInfo {
  firstName: string;
  lastName: string;
  personalNumber: string;
  civilStatus: 'OG' | 'G';
  citizenship: string;
}

export interface UserInfo {
  contactInfo: ContactInfo;
  personalInfo: PersonalInfo;
  address: Address;
  DID: DecentralizedIdentifier;
}
