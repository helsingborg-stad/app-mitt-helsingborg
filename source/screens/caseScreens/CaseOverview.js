import {Icon, Text} from '../../components/atoms';
import {Card, Header, ScreenWrapper} from '../../components/molecules';
import {
  CaseDispatch,
  CaseState,
  caseStatus,
  caseTypes,
} from '../../store/CaseContext';
import FormContext from '../../store/FormContext';
import PropTypes from 'prop-types';
import icons from '../../helpers/Icons';
import styled from 'styled-components/native';
import React, {useContext, useEffect, useState, useRef} from 'react';
import {Animated, Easing} from 'react-native';
import {formatUpdatedAt} from '../../helpers/DateHelpers';

const Container = styled.ScrollView`
  flex: 1;
  padding-left: 16px;
  padding-right: 16px;
`;

const ListHeading = styled(Text)`
  margin-left: 4px;
  margin-bottom: 8px;
`;

const Message = styled(Card)`
  margin-top: 32px;
  margin-bottom: 32px;
`;

const colorSchema = 'red';

/**
 * Returns a case card component depending on it's status
 * @param {string} status
 * @param {obj} latestCase
 * @param {obj} form
 * @param {obj} caseType
 * @param {obj} navigation
 * @param {func} createCase
 */
const computeCaseComponent = (
  status,
  latestCase,
  form,
  caseType,
  navigation,
  createCase,
) => {
  const updatedAt = latestCase?.updatedAt
    ? formatUpdatedAt(latestCase.updatedAt)
    : '';
  const currentStep = latestCase?.currentPosition?.currentMainStep || '';
  const totalSteps = form?.stepStructure ? form.stepStructure.length : 0;

  switch (status) {
    case caseStatus.onlyOldCases:
    case caseStatus.untouched:
      return (
        <Card colorSchema={colorSchema}>
          <Card.Body shadow color="neutral">
            <Card.Image source={icons[caseType.icon]} />
            <Card.Title>{caseType.name}</Card.Title>
            <Card.Button
              onClick={async () => {
                createCase(
                  form,
                  async (newCase) => {
                    navigation.navigate('Form', {caseData: newCase});
                  },
                  true,
                );
              }}>
              <Text>Sök ekonomiskt bistånd</Text>
              <Icon name="arrow-forward" />
            </Card.Button>
          </Card.Body>
        </Card>
      );

    case caseStatus.unfinishedNoCompleted:
    case caseStatus.unfinished:
      return (
        <>
          <ListHeading type="h5">Aktiva</ListHeading>

          <Card colorSchema={colorSchema}>
            <Card.Body
              shadow
              color="neutral"
              onPress={() => {
                navigation.navigate('UserEvents', {
                  screen: caseType.navigateTo,
                  params: {
                    id: latestCase.id,
                    name: caseType.name,
                  },
                });
              }}>
              <Card.Image source={icons[caseType.icon]} />
              <Card.Title>{caseType.name}</Card.Title>
              <Card.SubTitle>
                Steg {currentStep} / {totalSteps}
              </Card.SubTitle>
              <Card.Progressbar
                currentStep={currentStep}
                totalStepNumber={totalSteps}
              />
              <Card.Text italic>Senast uppdaterad {updatedAt}</Card.Text>
              <Card.Button
                onClick={() => {
                  navigation.navigate('Form', {caseId: latestCase.id});
                }}>
                <Text>Fortsätt ansökan</Text>
                <Icon name="arrow-forward" />
              </Card.Button>
            </Card.Body>
          </Card>
        </>
      );

    case caseStatus.recentlyCompleted:
      return (
        <>
          <ListHeading type="h5">Aktiva</ListHeading>
          <Card colorSchema={colorSchema}>
            <Card.Body
              shadow
              color="neutral"
              onPress={() => {
                navigation.navigate('UserEvents', {
                  screen: caseType.navigateTo,
                  params: {
                    id: latestCase.id,
                    name: caseType.name,
                  },
                });
              }}>
              <Card.Image source={icons[caseType.icon]} />
              <Card.Title>{caseType.name}</Card.Title>
              <Card.SubTitle>Inskickad</Card.SubTitle>
              <Card.Text italic>Skickades in {updatedAt}</Card.Text>
              <Card.Button
                onClick={() => {
                  navigation.navigate('UserEvents', {
                    screen: caseType.navigateTo,
                    params: {
                      id: latestCase.id,
                      name: caseType.name,
                    },
                  });
                }}>
                <Text>Visa ansökan</Text>
                <Icon name="arrow-forward" />
              </Card.Button>
            </Card.Body>
          </Card>
        </>
      );

    default:
      return null;
  }
};

/**
 * Case overview screen
 * @param {obj} props
 */
function CaseOverview({navigation}) {
  const [caseItems, setCaseItems] = useState([]);
  const {getCasesByFormIds} = useContext(CaseState);
  const {getForm, getFormIdsByFormTypes} = useContext(FormContext);
  const {createCase} = useContext(CaseDispatch);
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      easing: Easing.back(),
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

  useEffect(() => {
    const updateItems = async () => {
      const updateItemsPromises = caseTypes.map(async (caseType) => {
        const formIds = await getFormIdsByFormTypes(caseType.formTypes);
        const [status, latestCase, relevantCases] = await getCasesByFormIds(
          formIds,
        );
        const form = await getForm(latestCase?.formId || formIds[0]);
        const component = computeCaseComponent(
          status,
          latestCase,
          form,
          caseType,
          navigation,
          createCase,
        );
        return {caseType, status, latestCase, component, cases: relevantCases};
      });

      await Promise.all(updateItemsPromises).then((updatedItems) => {
        setCaseItems(updatedItems);
      });
    };
    updateItems();
  }, [
    createCase,
    getCasesByFormIds,
    getForm,
    getFormIdsByFormTypes,
    navigation,
  ]);

  return (
    <ScreenWrapper>
      <Header title="Mina ärenden" />
      <Container>
        <Message colorSchema={colorSchema}>
          <Card.Body outlined>
            <Card.Title>Hej!</Card.Title>
            <Card.Text>
              Helsingborgs Stad testar att göra självservice lite mer personlig
              och i första steget så är det just Ekonomiskt Bistånd som står i
              fokus.
            </Card.Text>
          </Card.Body>
        </Message>
        {caseItems.length > 0 && (
          <Animated.View style={{opacity: fadeAnimation}}>
            {caseItems.map(({component}) => component)}
          </Animated.View>
        )}
      </Container>
    </ScreenWrapper>
  );
}

CaseOverview.propTypes = {
  navigation: PropTypes.object,
};

export default CaseOverview;
