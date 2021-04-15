import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing, RefreshControl } from 'react-native';
import icons from 'source/helpers/Icons';
import styled from 'styled-components/native';
import { useFocusEffect } from '@react-navigation/native';
import { Icon, Text } from '../../components/atoms';
import { Card, Header, ScreenWrapper } from '../../components/molecules';
import { getSwedishMonthNameByTimeStamp } from '../../helpers/DateHelpers';
import { CaseState, caseTypes } from '../../store/CaseContext';
import FormContext from '../../store/FormContext';
import { convertDataToArray, calculateSum } from '../../helpers/FormatVivaData';

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

Card.MessageBody = styled(Card.Body)`
  background-color: ${(props) => props.theme.colors.neutrals[5]};
`;

Card.LargeText = styled(Card.Text)`
  font-size: ${(props) => props.theme.fontSizes[4]}px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
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
  const currentStep =
    caseData?.forms?.[caseData.currentFormId]?.currentPosition?.currentMainStep || 0;
  const totalSteps = form?.stepStructure ? form.stepStructure.length : 0;
  const applicationPeriodMonth = caseData?.details?.period?.endDate
    ? getSwedishMonthNameByTimeStamp(caseData.details.period.endDate, true)
    : '';
  const { details: { workflow: { decision = {}, payments = {} } = {} } = {} } = caseData;
  const decisions = decision?.decisions?.decision
    ? convertDataToArray(decision.decisions.decision)
    : [];

  const paymentsArray = decisions.filter((decision) => decision.typecode === '01');
  const partiallyApprovedDecisions = decisions.filter((decision) => decision.typecode === '03');

  const statusType = caseData?.status?.type || '';
  const isNotStarted = statusType.includes('notStarted');
  const isOngoing = statusType.includes('ongoing');
  const isCompletionRequired = statusType.includes('completionRequired');

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
        <Card.SubTitle>{caseData.status.name}</Card.SubTitle>
        {isOngoing && <Card.Progressbar currentStep={currentStep} totalStepNumber={totalSteps} />}
        {applicationPeriodMonth && <Card.LargeText>{applicationPeriodMonth}</Card.LargeText>}
        {(isNotStarted || isOngoing || isCompletionRequired) && (
          <Card.Button
            onClick={() => {
              navigation.navigate('Form', { caseId: caseData.id });
            }}
          >
            {isOngoing && <Text>Fortsätt</Text>}
            {isNotStarted && <Text>Starta ansökan</Text>}
            {isCompletionRequired && <Text>Starta stickprov</Text>}
            <Icon name="arrow-forward" />
          </Card.Button>
        )}

        {Object.keys(paymentsArray).length > 0 && (
          <Card.Text strong colorSchema="neutral">
            Utbetalning: {calculateSum(paymentsArray)}
          </Card.Text>
        )}
        {Object.keys(partiallyApprovedDecisions).length > 0 && (
          <Card.Text colorSchema="neutral">
            Avslaget: {calculateSum(partiallyApprovedDecisions)}
          </Card.Text>
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
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { cases, getCasesByFormIds, fetchCases } = useContext(CaseState);
  const { getForm, getFormIdsByFormTypes } = useContext(FormContext);
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const wait = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

  const getCasesByStatuses = (statuses) =>
    caseItems.filter((caseData) => {
      let matchesStatus = false;
      statuses.forEach((status) => {
        matchesStatus = matchesStatus || caseData?.status?.type?.includes(status);
      });
      return matchesStatus;
    });

  const activeCases = getCasesByStatuses(['notStarted', 'active']);
  const closedCases = getCasesByStatuses(['closed']);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCases();
    wait(500).then(() => {
      setRefreshing(false);
    });
  }, [fetchCases]);

  useFocusEffect(
    useCallback(() => {
      fetchCases();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      Animated.timing(fadeAnimation, {
        toValue: 1,
        easing: Easing.ease,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [fadeAnimation])
  );

  useEffect(() => {
    const updateItems = async () => {
      const updateCaseItemsPromises = caseTypes.map(async (caseType) => {
        const formIds = await getFormIdsByFormTypes(caseType.formTypes);
        const formCases = getCasesByFormIds(formIds);
        const updatedFormCaseObjects = formCases.map(async (caseData) => {
          const form = await getForm(caseData.currentFormId);
          const component = computeCaseCardComponent(caseData, form, caseType, navigation);
          return { component, ...caseData };
        });
        return Promise.all(updatedFormCaseObjects).then((updatedItems) => updatedItems);
      });

      await Promise.all(updateCaseItemsPromises).then((updatedItems) => {
        const flattenedList = updatedItems.flat();
        flattenedList.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
        setCaseItems(flattenedList);
        setIsLoading(false);
      });
    };

    updateItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cases]);

  return (
    <ScreenWrapper {...props}>
      <Header title="Mina ärenden" />
      <Container refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <ListHeading type="h5">Aktiva</ListHeading>
        {activeCases.length > 0 && (
          <Animated.View style={{ opacity: fadeAnimation }}>
            {activeCases.map((caseData) => caseData.component)}
          </Animated.View>
        )}

        {!isLoading && activeCases.length === 0 && (
          <Animated.View style={{ opacity: fadeAnimation }}>
            <Card>
              <Card.MessageBody>
                <Card.Text>Du har inga aktiva ärenden.</Card.Text>
              </Card.MessageBody>
            </Card>
          </Animated.View>
        )}

        {closedCases.length > 0 && (
          <Animated.View style={{ opacity: fadeAnimation }}>
            <ListHeading type="h5">Avslutade</ListHeading>
            {closedCases.map((caseData) => caseData.component)}
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
