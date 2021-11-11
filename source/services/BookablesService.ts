import { get } from "../helpers/ApiRequest";

export type BookableItem = {
  name: string;
  sharedMailbox: string;
  address: string;
  formId: string;
};

async function getBookables(): Promise<BookableItem[]> {
  return new Promise((resolve, reject) => {
    get("/bookables")
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(response.message);
        }
        const bookables = response?.data?.data as BookableItem[];
        if (bookables) return resolve(bookables);
        throw new Error("getBookables: Response does not contain data.data");
      })
      .catch((error) => reject(error));
  });
}

export { getBookables };
