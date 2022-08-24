import { useEffect, useState, useCallback } from "react";

import { getPasswordForForm } from "../../services/encryption/CaseEncryptionHelper";
import { wrappedDefaultStorage } from "../../services/storage/StorageService";

import type { Case } from "../../types/Case";
import type { User } from "../../types/UserTypes";

type Password = Record<string, string | undefined>;

function useGetFormPasswords(
  cases: Record<string, Case>,
  user: User | null
): Password {
  const [passwords, setPasswords] = useState<Password>({});

  const getPasswordAccumulator = useCallback(
    async (
      oldValue,
      caseItem,
      caseUser: User
    ): Promise<{ password: string }> => {
      const { currentFormId } = caseItem;
      const form = caseItem.forms[currentFormId];
      const hasSymmetricKey = !!form.encryption.symmetricKeyName;

      const encryptionPin = hasSymmetricKey
        ? await getPasswordForForm(form, caseUser, wrappedDefaultStorage)
        : undefined;

      return { ...oldValue, [currentFormId]: encryptionPin };
    },
    []
  );

  useEffect(() => {
    const tryGetPassword = async () => {
      if (Object.keys(cases).length > 0 && user !== null) {
        const getPasswordsPromise = Object.values(cases).reduce(
          (oldValue, newValue) =>
            getPasswordAccumulator(oldValue, newValue, user),
          Promise.resolve({})
        );

        const formPasswords = await getPasswordsPromise;
        setPasswords(formPasswords as Password);
      }
    };

    void tryGetPassword();
  }, [cases, user, getPasswordAccumulator]);

  return passwords;
}

export default useGetFormPasswords;
