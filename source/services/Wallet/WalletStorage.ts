import RNSInfo from 'react-native-sensitive-info';
import { User } from '../../types/UserTypes';
import { Case } from '../../types/CaseType';
import { generateCredential, generateUserDID, checkCredential } from './ApiHelpers';
import { DecentralizedIdentifier, UserInfo } from './types';
import jwtDecode from "jwt-decode"

const WALLET_PREFIX = 'WALLET';
const USER = `${WALLET_PREFIX}.USER`;
const CASES = `${WALLET_PREFIX}.CASES`;
const CASES_IDS = `${CASES}.IDS`;
export const VALIDATE_CREDENTIALS = true; //whether or not to validate the stored credential against the API when fetching data from storage

const walletPreferencesName = 'mittHbgWalletPrefs';
const keychainServiceName = 'mittHbgWallet';
const keychainOptions = {
  sharedPreferencesName: walletPreferencesName,
  keychainService: keychainServiceName,
};
/**************** Start of wrapper functions ***************/
/** 
 * Wrapper for storing items in keychain-protected storage. 
 * The place to put later additional encryption.
 */
const setItem = async (key: string, value: string) => {
  return RNSInfo.setItem(key, value, keychainOptions);
}
/** 
 * Wrapper for getting items from keychain-protected storage.
 */
const getItem = async (key: string) => {
  try { 
    const res = await RNSInfo.getItem(key, keychainOptions);
    if (typeof res === 'string') {
      return res;
    } 
    return undefined;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
/** Gets the items for all the keys in the passed array of strings */
const multiGet = async (keys: string[]) => {
  return keys.map( async key => { return await getItem(key)});
}
/** Delete the selected value from storage */
const deleteItem = async (key: string) => {
  return RNSInfo.deleteItem(key, keychainOptions);
}

/*************** End of wrapper functions ***************/

/** Stores a user to the secured local storage */
export const createUser = async (user: User) => {
  const userDID = await getItem(`${USER}.DID`);
  if (!userDID) {
    const newDID = await generateUserDID();
    setItem(`${USER}.DID`, JSON.stringify(newDID));
  }
  const personalInfo: PersonalInfo = {
    firstName: user.firstName,
    lastName: user.lastName,
    civilStatus: (user.civilStatus as 'OG' | 'G'),
    citizenship: '',
  };
  const contactInfo: ContactInfo = {
    email: user.email,
    phone: user.mobilePhone,
  };
  putUserInfo({personalInfo, contactInfo}); 
};

/** Updates a users info */
export const putUserInfo = async (info: Partial<UserInfo>) => {
  const keys = Object.keys(info);
  const userDID: DecentralizedIdentifier = JSON.parse(await getItem(`${USER}.DID`));

  keys.forEach(async key => {
    const credential = await generateCredential(userDID.id, info[key]);
    setItem(`${USER}.${key}`, credential);
  });
};

/** Returns the stored user info */
export const getUser = async (): Promise<Partial<UserInfo>> => {
  const keys = ['address', 'personalInfo', 'contactInfo'];
  const user: Partial<UserInfo> = {};

  const userInfo = keys.map(async key => {
    const token = await getItem(`${USER}.${key}`);
    if (token) {
      if (VALIDATE_CREDENTIALS) {
        const tokenValid = await checkCredential(token);
        if (tokenValid) {
          return jwtDecode(token);
        }
      } else {
        return jwtDecode(token);
      }
    }
    return {};
  });
  const resolvedInfo = await Promise.all(userInfo);
  resolvedInfo.forEach((data, index) => {
    user[keys[index]] = data;
  });

  return user; 
};

/** Stores a case in the local storage */
export const putCase = async (caseId: string, caseData: Partial<Case>): Promise<Case> => {
  const userDID: DecentralizedIdentifier = JSON.parse(await getItem(`${USER}.DID`));
  const oldCase = await getCase(caseId);
  let updatedCase: Case;
  if (oldCase) {
    updatedCase = { ...oldCase, ...caseData };
    const credential = await generateCredential(userDID.id, updatedCase); 
    setItem(`${CASES}.${caseData.id}`, credential); 
  }
  else {
    updatedCase = caseData as Case;
    const credential = await generateCredential(userDID.id, caseData); 
    setItem(`${CASES}.${caseData.id}`, credential); 
  }
  const cIds = await getItem(CASES_IDS);
  if (cIds){
    const caseIds: string[] = JSON.parse(cIds);
    if (!caseIds.includes(caseId)) {
      caseIds.push(caseData.id);  
      setItem(CASES_IDS, JSON.stringify(caseIds));
    }
  } else {
    const newCaseIds = [ caseData.id ];
    setItem(CASES_IDS, JSON.stringify(newCaseIds));
  }
  return updatedCase;
}

/** Fetches a case from local storage */
export const getCase = async (caseId: string): Promise<Case> => {
  const cIds = await getItem(CASES_IDS);
  const caseIds = cIds ? JSON.parse(cIds) : [];
  if (caseIds.includes(caseId)){
    const token = await getItem(`${CASES}.${caseId}`);
    if (VALIDATE_CREDENTIALS) {
      const tokenValid = await checkCredential(token);
      if (tokenValid) {
        return jwtDecode(token);
      }
    } else {
      return jwtDecode(token);
    }
  }
  return null;
}

/** Returns all stored cases in an array */
export const getAllCases = async (): Promise<Case[]> => {
  const cIds = await getItem(CASES_IDS);
  if (!cIds) return []; 
  const caseIds: string[] = JSON.parse(cIds);
  const caseTokens = await multiGet(caseIds.map(id => `${CASES}.${id}`));
  const tokens = await Promise.all(caseTokens);
  const cases: Promise<Case>[] = tokens.map(async (token) => {
    if (VALIDATE_CREDENTIALS) {
      const tokenValid = await checkCredential(await token);
      if (tokenValid) {
        return jwtDecode(token);
      } else {
        return { error: 'invalid credential'};
      }
    } else {
      return jwtDecode(token);
    } 
  });
  const result = await Promise.all(cases);
  return result;
}

/** Clears all locally stored case data */
export const clearCases = async () => {
  const cIds = await getItem(CASES_IDS);
  if (cIds) {
    const caseIds: string[] = JSON.parse(cIds);
    caseIds.forEach(id => {
      deleteItem(id);
    });
    deleteItem(CASES_IDS);
  }
}