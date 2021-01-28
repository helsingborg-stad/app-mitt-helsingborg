import React, { useContext, useEffect, useState, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import PropTypes from 'prop-types';
import icons from 'source/helpers/Icons';
import styled from 'styled-components/native';

import FormContext from '../../store/FormContext';
import { CaseState, caseTypes } from '../../store/CaseContext';
import { Icon, Text } from '../../components/atoms';
import { Card, Header, ScreenWrapper } from '../../components/molecules';

const Container = styled.ScrollView`
  flex: 1;
  padding-left: 16px;
  padding-right: 16px;
`;

const ListHeading = styled(Text)`
  margin-left: 4px;
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
  const commonCardProps = {
    colorSchema,
  };

  switch (caseData.status) {
    case 'closed':
    case 'submitted':
    case 'processing':
      return (
        <Card key={caseData.id} {...commonCardProps}>
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
            <Card.Title>{caseType.name}</Card.Title>
            <Card.SubTitle>{caseData.statusDetails.name}</Card.SubTitle>
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
          </Card.Body>
        </Card>
      );

    case 'ongoing':
      return (
        <Card key={caseData.id} {...commonCardProps}>
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
            <Card.Title>{caseType.name}</Card.Title>
            <Card.Title>{caseData.status}</Card.Title>
            <Card.SubTitle>
              Steg {currentStep} / {totalSteps}
            </Card.SubTitle>
            <Card.Progressbar currentStep={currentStep} totalStepNumber={totalSteps} />
            <Card.Button
              onClick={() => {
                navigation.navigate('Form', { caseId: caseData.id });
              }}
            >
              <Text>Fortsätt ansökan</Text>
              <Icon name="arrow-forward" />
            </Card.Button>
          </Card.Body>
        </Card>
      );

    case 'notStarted':
    default:
      return (
        <Card key={caseData.id} {...commonCardProps}>
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
            <Card.Title>{caseType.name}</Card.Title>
            <Card.SubTitle>{caseData.statusDetails.name}</Card.SubTitle>
            <Card.Button
              onClick={() => {
                navigation.navigate('Form', { caseId: caseData.id });
              }}
            >
              <Text>Starta ansökan</Text>
              <Icon name="arrow-forward" />
            </Card.Button>
          </Card.Body>
        </Card>
      );
  }
};

/**
 * Case overview screen
 * @param {obj} props
 */
function CaseOverview(props) {
  const { navigation } = props;
  const [caseItems, setCaseItems] = useState([]);
  const { cases, getCasesByFormIds, getCaseStatusDetails } = useContext(CaseState);
  const { getForm, getFormIdsByFormTypes } = useContext(FormContext);

  const getCasesByStatusGroup = (status) => {
    switch (status) {
      case 'active':
        return caseItems.flatMap((caseItem) =>
          caseItem.statusDetails.group === 'active' ? [caseItem.component] : []
        );
      case 'closed':
        return caseItems.flatMap((caseItem) =>
          caseItem.statusDetails.group === 'closed' ? [caseItem.component] : []
        );
      case 'notStarted':
        return caseItems.flatMap((caseItem) =>
          caseItem.statusDetails.group === 'notStarted' ? [caseItem.component] : []
        );
      default:
        return caseItems;
    }
  };

  const activeCases = getCasesByStatusGroup('active');
  const closedCases = getCasesByStatusGroup('closed');
  const notStartedCases = getCasesByStatusGroup('notStarted');
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      easing: Easing.back(),
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

  useEffect(() => {
    const updateItems = async () => {
      const updateItemsPromises = caseTypes.map(async (caseType) => {
        const formIds = await getFormIdsByFormTypes(caseType.formTypes);
        const formCases = getCasesByFormIds(formIds);

        const updatedFormCaseObjects = formCases.map(async (caseData) => {
          const form = await getForm(caseData.formId);
          caseData.statusDetails = getCaseStatusDetails(caseData);
          const component = computeCaseCardComponent(caseData, form, caseType, navigation);
          return { component, ...caseData };
        });

        return Promise.all(updatedFormCaseObjects).then((updatedItems) => updatedItems);
      });

      await Promise.all(updateItemsPromises).then((updatedItems) => {
        const flattenedList = [].concat(...updatedItems);
        setCaseItems(flattenedList);
      });
    };

    updateItems();
  }, [navigation]);

  return (
    <ScreenWrapper {...props}>
      <Header title="Mina ärenden" />
      <Container>
        {Object.keys(notStartedCases).length > 0 && (
          <Animated.View style={{ opacity: fadeAnimation }}>
            <ListHeading key="active-cases" type="h5">
              Öppna
            </ListHeading>
            {notStartedCases}
          </Animated.View>
        )}

        {Object.keys(activeCases).length > 0 && (
          <Animated.View style={{ opacity: fadeAnimation }}>
            <ListHeading key="active-cases" type="h5">
              Aktiva
            </ListHeading>
            {activeCases}
          </Animated.View>
        )}

        {Object.keys(closedCases).length > 0 && (
          <Animated.View style={{ opacity: fadeAnimation }}>
            <ListHeading key="active-cases" type="h5">
              Avslutade
            </ListHeading>
            {closedCases}
          </Animated.View>
        )}
      </Container>
    </ScreenWrapper>
  );
}

export default CaseOverview;
