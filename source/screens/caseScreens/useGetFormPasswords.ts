import { useEffect, useState, useCallback } from "react";

import { getPasswordForForm } from "../../services/encryption/CaseEncryptionHelper";
import { wrappedDefaultStorage } from "../../services/storage/StorageService";

import type { Case } from "../../types/Case";
import type { User } from "../../types/UserTypes";

type Password = string | null;
interface PasswordPair {
  id: string;
  password: Password;
}

function useGetFormPasswords(
  cases: Record<string, Case>,
  user: User | null
): Record<string, Password> {
  const [passwords, setPasswords] = useState({});

  const getPasswordIdPair = useCallback(
    async (
      caseItem: Case,
      caseUser: User
    ): Promise<{ id: string; password: Password }> => {
      const { currentFormId, id } = caseItem;
      const form = caseItem.forms[currentFormId];
      const hasSymmetricKey = !!form.encryption?.symmetricKeyName;

      const encryptionPin = hasSymmetricKey
        ? await getPasswordForForm(form, caseUser, wrappedDefaultStorage)
        : null;

      return { id, password: encryptionPin };
    },
    []
  );

  const formatPasswords = (
    previousValue: { id: string; password: Password },
    newValue: { id: string; password: Password }
  ) => ({
    ...previousValue,
    [newValue.id]: newValue.password,
  });

  useEffect(() => {
    const tryGetPassword = async () => {
      if (Object.keys(cases).length > 0 && user !== null) {
        const passwordPairPromises = Object.values(cases).map((caseItem) =>
          getPasswordIdPair(caseItem, user)
        );

        const passwordPairs = await Promise.all(passwordPairPromises);
        const formPasswords = passwordPairs.reduce(
          formatPasswords,
          {} as PasswordPair
        );

        setPasswords(formPasswords);
      }
    };

    void tryGetPassword();
  }, [cases, user, getPasswordIdPair]);

  return passwords;
}

export default useGetFormPasswords;
