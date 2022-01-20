import React, { useEffect, createContext, useState } from "react";

import moment from "moment";
import { getReferenceCodeForUser } from "../helpers/BookingHelper";
import { getHistoricalAttendees } from "../services/BookingService";
import { getBookables, BookableItem } from "../services/BookablesService";

interface BookablesProviderInterface {
  isSignedIn: boolean;
  children: Element | Element[];
  isDevMode: boolean;
  user: Record<string, string>;
}

interface BookablesContextInterface {
  isFetchingBookables: boolean;
  bookables: BookableItem[];
  bookablesError: Error | null;
  isFetchingContacts: boolean;
  contacts: string[];
  contactsError: Error | null;
}

const BookablesContext = createContext<BookablesContextInterface>({
  isFetchingBookables: false,
  bookables: [],
  bookablesError: null,
  isFetchingContacts: false,
  contacts: [],
  contactsError: null,
});

const BookablesProvider = (props: BookablesProviderInterface): JSX.Element => {
  const { children, isSignedIn, isDevMode = true, user } = props;

  const [bookables, setBookables] = useState<BookableItem[]>([]);
  const [isFetchingBookables, setIsFetchingBookables] = useState(false);
  const [bookablesError, setBookablesError] = useState<null | Error>(null);

  const [contacts, setContacts] = useState<string[]>([]);
  const [isFetchingContacts, setIsFetchingContacts] = useState(false);
  const [contactsError, setContactsError] = useState<null | Error>(null);

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
        setBookablesError(error as Error);
        console.log("Error fetching bookables: ", error);
      }

      setIsFetchingBookables(false);
    };

    const tryFetchContacts = async () => {
      try {
        if (isSignedIn && isDevMode && user.personalNumber) {
          setIsFetchingContacts(true);
          setContactsError(null);

          const fetchedContacts = await getHistoricalAttendees(
            getReferenceCodeForUser(user),
            moment().subtract(6, "months").format(),
            moment().add(6, "months").format()
          );
          setContacts(fetchedContacts);
        }
      } catch (error) {
        setContactsError(error as Error);
        console.log("Error fetching contacts: ", error);
      }

      setIsFetchingContacts(false);
    };

    void tryFetchBookables();
    void tryFetchContacts();
  }, [isSignedIn, isDevMode, user]);

  const value = {
    isFetchingBookables,
    bookables,
    bookablesError,
    isFetchingContacts,
    contacts,
    contactsError,
  };

  return (
    <BookablesContext.Provider value={value}>
      {children}
    </BookablesContext.Provider>
  );
};

export default BookablesContext;
export { BookablesProvider };
