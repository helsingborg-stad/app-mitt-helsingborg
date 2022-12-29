import React, { useState } from "react";
import { storiesOf } from "@storybook/react-native";
import StoryWrapper from "../../molecules/StoryWrapper";
import FormList from "./FormList";

import type { Form } from "../../../types/FormTypes";

const FormListStory = () => {
  const [_, setForm] = useState<Form | null>(null);
  return <FormList onClickCallback={(form) => setForm(form)} />;
};

storiesOf("Form List", module).add("default", (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <StoryWrapper {...props}>
    <FormListStory />
  </StoryWrapper>
));
