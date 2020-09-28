import React, { useContext, useState, useEffect } from 'react';
import { Heading, Text, Button } from 'app/components/atoms';
import { ScreenWrapper } from 'app/components/molecules';
import { CaseState, caseStatus, caseTypes } from 'app/store/CaseContext';
import FormContext from 'app/store/FormContext';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { CaseTypeListItem } from '../../components/molecules/ListItem';
import { formatUpdatedAt } from '../../helpers/DateHelpers';

const CaseOverviewWrapper = styled(ScreenWrapper)`
  padding-left: 0;
  padding-right: 0;
  padding-top: 40px;
  padding-bottom: 0;
  background-color: #f5f5f5;
`;
const Container = styled.ScrollView`
  padding-left: 16px;
  padding-right: 16px;
`;
const ButtonContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  width: 100%;
`;
const List = styled.View`
  margin-top: 24px;
`;
const ListHeading = styled(Heading)`
  margin-left: 4px;
  margin-bottom: 8px;
`;

const computeCaseComponent = (status, latestCase, navigation) => {
  let updatedAt = '';
  if (latestCase) {
    updatedAt = formatUpdatedAt(latestCase.updatedAt);
  }

  switch (status) {
    case caseStatus.untouched:
      return <Text small>Inga ärenden</Text>;

    case caseStatus.unfinishedNoCompleted:
    case caseStatus.unfinished:
      return (
        <>
          <Text small style={{ color: 'red' }}>
            Påbörjad ansökan, uppdaterad {updatedAt}
          </Text>
          <ButtonContainer>
            <Button
              color="orange"
              onClick={() => {
                navigation.navigate('Form', { caseId: latestCase.id });
              }}
            >
              <Text>Fortsätt ansökan</Text>
            </Button>
          </ButtonContainer>
        </>
      );

    case caseStatus.recentlyCompleted:
      return <Text small>Inskickad ansökan {updatedAt}</Text>;

    case caseStatus.onlyOldCases:
      return <Text small>Inga aktiva ärenden</Text>;

    default:
      return null;
  }
};

const CaseOverview = ({ navigation }) => {
  const [caseItems, setCaseItems] = useState([]);
  const { getCasesByFormIds } = useContext(CaseState);
  const { getFormIdsByFormTypes } = useContext(FormContext);

  useEffect(() => {
    const updateItems = async () => {
      const updateItemsPromises = caseTypes.map(async caseType => {
        const formIds = await getFormIdsByFormTypes(caseType.formTypes);

        const [status, latestCase, relevantCases] = await getCasesByFormIds(formIds);
        const component = computeCaseComponent(status, latestCase, navigation);
        return { caseType, status, latestCase, component, cases: relevantCases };
      });

      await Promise.all(updateItemsPromises).then(updatedItems => {
        setCaseItems(updatedItems);
      });
    };
    updateItems();
  }, [getCasesByFormIds, getFormIdsByFormTypes, navigation]);

  return (
    <CaseOverviewWrapper>
      <Container>
        <List>
          <ListHeading type="h3">Aktiva ansökningar</ListHeading>
          {caseItems?.length > 0 &&
            caseItems
              .filter(
                item =>
                  item.status !== caseStatus.untouched && item.status !== caseStatus.onlyOldCases
              )
              .map(item => {
                const { caseType, component } = item;
                return (
                  <CaseTypeListItem
                    key={caseType.name}
                    title={caseType.name}
                    icon={caseType.icon}
                    onClick={() => {
                      navigation.navigate('UserEvents', {
                        screen: caseType.navigateTo,
                        params: { caseType },
                      });
                    }}
                  >
                    {component}
                  </CaseTypeListItem>
                );
              })}
        </List>
      </Container>
      <ButtonContainer style={{ marginBottom: 20 }}>
        <Button
          color="green"
          onClick={() => {
            navigation.navigate('UserEvents', {
              screen: 'Services',
            });
          }}
        >
          <Text>Starta ny ansökan</Text>
        </Button>
      </ButtonContainer>
    </CaseOverviewWrapper>
  );
};

CaseOverview.propTypes = {
  navigation: PropTypes.object,
};

export default CaseOverview;
