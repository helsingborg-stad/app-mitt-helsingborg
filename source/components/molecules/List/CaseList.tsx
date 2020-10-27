import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Heading from '../../atoms/Heading/Heading';
import ListItem from '../ListItem/ListItem';
import { Case } from '../../../types/CaseType';
import { formatUpdatedAt } from '../../../helpers/DateHelpers';

const List = styled.View`
  margin-top: 44px;
  padding: 10px;
  margin: 4px;
`;
const ListHeading = styled(Heading)`
  margin-left: 4px;
  margin-bottom: 8px;
`;

const sortCasesByLastUpdated = (cases: Case[]) => cases.sort((a, b) => b.updatedAt - a.updatedAt);

const CaseList: React.FC<{ cases: Case[]; navigation: StackNavigationProp<any, any> }> = ({
  cases,
  navigation,
}) => {
  if (cases.length > 0) {
    return (
      <List>
        <ListHeading type="h3">Ärenden</ListHeading>
        {sortCasesByLastUpdated(cases).map(item => (
          <ListItem
            key={`${item.id}`}
            highlighted
            title={formatUpdatedAt(item.updatedAt)}
            text="Ekonomiskt bistånd, perioden XX"
            iconName={null}
            imageSrc={null}
            onClick={() => {
              navigation.navigate('Form', { caseId: item.id });
            }}
          />
        ))}
      </List>
    );
  }
  return null;
};

CaseList.propTypes = {
  cases: PropTypes.array,
  navigation: PropTypes.object,
};

export default CaseList;
