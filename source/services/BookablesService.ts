import { get } from "../helpers/ApiRequest";

export type BookableItem = {
  name: string;
  sharedMailbox: string;
  address: string;
  formId: string;
};

const getBookables = async (): Promise<BookableItem[]> => {
  const response = await get("/bookables");
  if (response.status !== 200) {
    throw new Error(response.message);
  }
  const bookables = response?.data?.data as BookableItem[];
  if (bookables) return bookables;
  throw new Error(
    "getBookables: Response does not contain data.data.attributes"
  );
};

const getAdministratorsBySharedMailbox = async (
  sharedMailbox: string
): Promise<string[]> => {
  const response = await get(
    `/bookables/getAdministratorsByEmail/${sharedMailbox}`
  );
  if (response.status !== 200) {
    throw new Error(response.message);
  }
  const admins = response?.data?.data?.attributes;
  if (admins) return admins;
  throw new Error(
    "getAdministratorsBySharedMailbox: Response does not contain data.data.attributes"
  );
};

export { getBookables, getAdministratorsBySharedMailbox };
