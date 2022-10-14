import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components/native";
import { Text } from "../../atoms";
import { ListItem } from "../../molecules";
import FormContext from "../../../store/FormContext";

import type { Form } from "../../../types/FormTypes";

const List = styled.ScrollView`
  margin-top: 24px;
`;

const ListHeading = styled(Text).attrs({ type: "h5" })`
  margin-left: 4px;
  margin-bottom: 8px;
`;

interface FormListProps {
  heading: string;
  showSubforms: boolean;
  onClickCallback: (form: Form | null) => void;
}
const FormList = ({
  onClickCallback,
  heading,
  showSubforms,
}: FormListProps): JSX.Element => {
  const [formSummaries, setFormSummaries] = useState<Form[]>([]);
  const { getFormSummaries, getForm } = useContext(FormContext);

  useEffect(() => {
    async function fetchForms() {
      const formSummariesResult = await getFormSummaries();
      setFormSummaries(
        formSummariesResult.filter((f) =>
          showSubforms ? f.subform : !f.subform
        )
      );
    }
    void fetchForms();
  }, [showSubforms, getFormSummaries]);

  return (
    <List>
      <ListHeading>{heading}</ListHeading>
      {formSummaries.length > 0 ? (
        formSummaries.map((form) => (
          <ListItem
            key={form.id}
            highlighted
            title={form.name}
            text={`${form.description}`}
            iconName={null}
            imageSrc={null}
            onClick={async () => {
              const f = await getForm(form.id);
              onClickCallback(f);
            }}
          />
        ))
      ) : (
        <Text style={{ marginLeft: 4 }}>Laddar...</Text>
      )}
    </List>
  );
};

FormList.propTypes = {
  heading: PropTypes.string,
  showSubforms: PropTypes.bool,
  onClickCallback: PropTypes.func,
};

FormList.defaultProps = {
  heading: "Formulär",
  showSubforms: false,
};

export default FormList;
