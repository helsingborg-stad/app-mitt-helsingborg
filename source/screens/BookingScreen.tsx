import React, { useContext, useEffect, useState } from "react";
import { Text } from "react-native";

import FormContext from "../store/FormContext";

const BookingScreen = (): JSX.Element => {
  const { getForm } = useContext(FormContext);
  const [form, setForm] = useState(undefined);

  useEffect(() => {
    const fetch = async () => {
      const result = await getForm("2d1645b0-267b-11ec-9991-3542f39b57f9");
      setForm(JSON.stringify(result));
      console.log("FOUND FORM: ", result);
    };

    fetch();
  }, [getForm]);

  return <Text>{form}</Text>;
};

export default BookingScreen;
