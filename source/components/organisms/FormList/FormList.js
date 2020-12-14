import React, {useContext, useState, useEffect} from 'react';
import {Heading, Text} from '../../../components/atoms';
import {ListItem} from '../../../components/molecules';
import FormContext from '../../../store/FormContext';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

const List = styled.ScrollView`
  margin-top: 24px;
`;

const ListHeading = styled(Heading)`
  margin-left: 4px;
  margin-bottom: 8px;
`;

const FormList = ({onClickCallback, heading, showSubforms}) => {
  const [formSummaries, setFormSummaries] = useState([]);
  const {getFormSummaries, getForm} = useContext(FormContext);

  useEffect(() => {
    async function fetchForms() {
      const formSummaries = await getFormSummaries();
      setFormSummaries(
        formSummaries.filter((f) => (showSubforms ? f.subform : !f.subform)),
      );
    }
    fetchForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSubforms]);

  return (
    <List>
      <ListHeading type="h3">{heading}</ListHeading>
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
        <Text style={{marginLeft: 4}}>Laddar...</Text>
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
  heading: 'Formulär',
  showSubforms: false,
};

export default FormList;
