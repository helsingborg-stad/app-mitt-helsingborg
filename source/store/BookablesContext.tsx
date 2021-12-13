import React, { useEffect, createContext, useState } from "react";

import { getBookables, BookableItem } from "../services/BookablesService";

interface BookablesProviderInterface {
  isSignedIn: boolean;
  children: Element | Element[];
  isDevMode: boolean;
}

const BookablesContext = createContext({
  isFetchingBookables: false,
  bookables: [] as BookableItem[],
  bookablesError: null,
});

const BookablesProvider = (props: BookablesProviderInterface): JSX.Element => {
  const { children, isSignedIn, isDevMode = true } = props;

  const [bookables, setBookables] = useState<BookableItem[]>([]);
  const [isFetchingBookables, setIsFetchingBookables] = useState(false);
  const [bookablesError, setBookablesError] = useState<null | any>(null);

  useEffect(() => {
    const tryFetchBookables = async () => {
      try {
        if (isSignedIn && isDevMode) {
          setIsFetchingBookables(true);
          setBookablesError(null);

          const fetchedBookables = await getBookables();
          setBookables(fetchedBookables as BookableItem[]);
        }
      } catch (error) {
        setBookablesError(error);
        console.log("Error fetching bookables: ", error);
      }

      setIsFetchingBookables(false);
    };

    void tryFetchBookables();
  }, [isSignedIn, isDevMode]);

  const value = {
    isFetchingBookables,
    bookables,
    bookablesError,
  };

  return (
    <BookablesContext.Provider value={value}>
      {children}
    </BookablesContext.Provider>
  );
};

export default BookablesContext;
export { BookablesProvider };
