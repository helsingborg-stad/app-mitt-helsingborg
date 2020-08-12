import React, { useContext, useState, useEffect } from 'react';
import { NavItems } from 'app/assets/dashboard';
import { Heading, Text } from 'app/components/atoms';
import { GroupedList, Header, ListItem, ScreenWrapper } from 'app/components/molecules';
import AuthContext from 'app/store/AuthContext';
import FormContext from 'app/store/FormContext';
import CaseContext from 'app/store/CaseContext';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

const List = styled.ScrollView`
  margin-top: 24px;
`;

const ListHeading = styled(Heading)`
  margin-left: 4px;
  margin-bottom: 8px;
`;

const FormList = ({ onClickCallback }) => {
  const [forms, setForms] = useState([]);
  const { getFormSummaries } = useContext(FormContext);

  useEffect(() => {
    async function fetchForms() {
      const formSummaries = await getFormSummaries();
      setForms(formSummaries.filter(f => !f.subform));
    }
    fetchForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <List>
      <ListHeading type="h3">Forms</ListHeading>
      {forms.length > 0 ? (
        forms.map(form => (
          <ListItem
            key={form.id}
            highlighted
            title={form.name}
            text={`${form.description}`}
            iconName={null}
            imageSrc={null}
            onClick={() => onClickCallback(form.id)}
          />
        ))
      ) : (
        <Text style={{ marginLeft: 4 }}>Inga formulär laddades...</Text>
      )}
    </List>
  );
};

FormList.propTypes = {
  onClickCallback: PropTypes.func,
};

export default FormList;
