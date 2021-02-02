import PropTypes from 'prop-types';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import icons from 'source/helpers/Icons';
import styled from 'styled-components/native';
import { Icon, Text } from '../../components/atoms';
import { Card, Header, ScreenWrapper } from '../../components/molecules';
import { getSwedishMonthNameByTimeStamp } from '../../helpers/DateHelpers';
import { CaseState, caseTypes } from '../../store/CaseContext';
import FormContext from '../../store/FormContext';

const Container = styled.ScrollView`
  flex: 1;
  padding-left: 16px;
  padding-right: 16px;
`;

const ListHeading = styled(Text)`
  margin-left: 4px;
  margin-top: 24px;
  margin-bottom: 8px;
`;

const colorSchema = 'red';

/**
 * Returns a case card component depending on it's status
 * @param {obj} caseData
 * @param {obj} form
 * @param {obj} caseType
 * @param {obj} navigation
 */
const computeCaseCardComponent = (caseData, form, caseType, navigation) => {
  const currentStep = caseData?.currentPosition?.currentMainStep || 0;
  const totalSteps = form?.stepStructure ? form.stepStructure.length : 0;
  const applicationPeriodMonth = caseData?.details?.period?.endDate
    ? getSwedishMonthNameByTimeStamp(caseData.details.period.endDate, true)
    : '';
  const isNotStarted = caseData?.status?.type?.includes('notStarted');
  const isOngoing = caseData?.status?.type?.includes('ongoing');

  return (
    <Card key={caseData.id} colorSchema={colorSchema}>
      <Card.Body
        shadow
        color="neutral"
        onPress={() => {
          navigation.navigate('UserEvents', {
            screen: caseType.navigateTo,
            params: {
              id: caseData.id,
              name: caseType.name,
            },
          });
        }}
      >
        <Card.Image source={icons[caseType.icon]} />
        <Card.Title colorSchema="neutral">{caseType.name}</Card.Title>
        {isOngoing ? (
          <Card.SubTitle>
            Steg {currentStep} / {totalSteps}
          </Card.SubTitle>
        ) : (
          <Card.SubTitle>{caseData.status.name}</Card.SubTitle>
        )}
        {isOngoing && <Card.Progressbar currentStep={currentStep} totalStepNumber={totalSteps} />}
        {isNotStarted && applicationPeriodMonth && <Card.Text>{applicationPeriodMonth}</Card.Text>}
        {isNotStarted || isOngoing ? (
          <Card.Button
            onClick={() => {
              navigation.navigate('Form', { caseId: caseData.id });
            }}
          >
            {isOngoing ? <Text>Fortsätt ansökan</Text> : <Text>Starta ansökan</Text>}
            <Icon name="arrow-forward" />
          </Card.Button>
        ) : (
          <Card.Button
            onClick={() => {
              navigation.navigate('UserEvents', {
                screen: caseType.navigateTo,
                params: {
                  id: caseData.id,
                  name: caseType.name,
                },
              });
            }}
          >
            <Text>Visa ansökan</Text>
            <Icon name="arrow-forward" />
          </Card.Button>
        )}
      </Card.Body>
    </Card>
  );
};

/**
 * Case overview screen
 * @param {obj} props
 */
function CaseOverview(props) {
  const { navigation } = props;
  const [caseItems, setCaseItems] = useState([]);
  const { cases, getCasesByFormIds } = useContext(CaseState);
  const { getForm, getFormIdsByFormTypes } = useContext(FormContext);
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const getCasesByStatus = (status) =>
    caseItems.flatMap((caseItem) =>
      caseItem?.status?.type?.includes(status) ? [caseItem.component] : []
    );

  const activeCases = [...getCasesByStatus('notStarted'), ...getCasesByStatus('active')];
  const closedCases = getCasesByStatus('closed');

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      easing: Easing.ease,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

  useEffect(() => {
    const updateItems = async () => {
      const updateCaseItemsPromises = caseTypes.map(async (caseType) => {
        const formIds = await getFormIdsByFormTypes(caseType.formTypes);
        const formCases = getCasesByFormIds(formIds);
        const updatedFormCaseObjects = formCases.map(async (caseData) => {
          const form = await getForm(caseData.formId);
          const component = computeCaseCardComponent(caseData, form, caseType, navigation);
          return { component, ...caseData };
        });
        return Promise.all(updatedFormCaseObjects).then((updatedItems) => updatedItems);
      });

      await Promise.all(updateCaseItemsPromises).then((updatedItems) => {
        const flattenedList = updatedItems.flat();
        flattenedList.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
        setCaseItems(flattenedList);
      });
    };

    updateItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cases]);

  return (
    <ScreenWrapper {...props}>
      <Header title="Mina ärenden" />
      <Container>
        <ListHeading type="h5">Aktiva</ListHeading>
        {activeCases.length > 0 ? (
          <Animated.View style={{ opacity: fadeAnimation }}>{activeCases}</Animated.View>
        ) : (
          <Text>Du har inga aktiva ärenden.</Text>
        )}

        {closedCases.length > 0 && (
          <Animated.View style={{ opacity: fadeAnimation }}>
            <ListHeading type="h5">Avslutade</ListHeading>
            {closedCases}
          </Animated.View>
        )}
      </Container>
    </ScreenWrapper>
  );
}

CaseOverview.propTypes = {
  navigation: PropTypes.any,
};

export default CaseOverview;
