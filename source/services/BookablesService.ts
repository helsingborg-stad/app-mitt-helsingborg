import { get } from "../helpers/ApiRequest";

export type BookableItem = {
  name: string;
  sharedMailbox: string;
  address: string;
  formId: string;
};

async function getBookables(): Promise<BookableItem[]> {
  const response = await get("/bookables");
  if (response.status !== 200) {
    throw new Error(response.message);
  }
  const bookables = response?.data?.data as BookableItem[];
  if (bookables) return bookables;
  throw new Error("getBookables: Response does not contain data.data");
}

export { getBookables };
