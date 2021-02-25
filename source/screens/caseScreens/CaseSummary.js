import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Animated, Easing, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { CaseState } from 'app/store/CaseContext';
import FormContext from 'app/store/FormContext';
import styled from 'styled-components/native';
import { useIsFocused } from '@react-navigation/native';
import icons from '../../helpers/Icons';
import { launchPhone, launchEmail } from '../../helpers/LaunchExternalApp';
import { getSwedishMonthNameByTimeStamp } from '../../helpers/DateHelpers';
import { Icon, Text } from '../../components/atoms';
import { Card, ScreenWrapper } from '../../components/molecules';
import { Modal, useModal } from '../../components/molecules/Modal';
import BackNavigation from '../../components/molecules/BackNavigation';
import Button from '../../components/atoms/Button';

const Container = styled.ScrollView`
  flex: 1;
  padding-left: 16px;
  padding-right: 16px;
`;

const SummaryHeading = styled(Text)`
  margin-left: 4px;
  margin-top: 30px;
  margin-bottom: 16px;
`;

const CloseModalButton = styled(BackNavigation)`
  padding: 24px 24px 0px 24px;
`;

const ModalContent = styled.View`
  margin: 32px;
  margin-top: 32px;
`;

const ModalFooter = styled.View`
  margin: 32px;
  justify-content: center;
  align-items: center;
`;

Card.CalculationRow = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

Card.Separator = styled.View`
  height: 2px;
  width: 100%;
  border-radius: 50px;
  margin-top: 4px;
  margin-bottom: 4px;
  background-color: ${(props) => props.theme.colors.neutrals[4]};
`;

const computeCaseCardComponent = (caseData, form, colorSchema, navigation, toggleModal) => {
  const { status, details: { period: { endDate } = {} } = {} } = caseData;
  const {
    currentPosition: { currentMainStep: currentStep },
  } = caseData.forms[caseData.currentFormId];
  const { details: { workflow: { decision = {} } = {} } = {} } = caseData;
  const totalSteps = form?.stepStructure?.length || 0;
  const applicationPeriodMonth = getSwedishMonthNameByTimeStamp(endDate, true);
  const isNotStarted = status?.type?.includes('notStarted');
  const isOngoing = status?.type?.includes('ongoing');
  const isClosed = status?.type?.includes('closed');

  return (
    <Card colorSchema={colorSchema}>
      <Card.Body shadow color="neutral">
        <Card.Title colorSchema="neutral">{applicationPeriodMonth || status.name}</Card.Title>
        {isOngoing ? (
          <Card.SubTitle>
            Steg {currentStep} / {totalSteps}
          </Card.SubTitle>
        ) : (
          <Card.SubTitle>{status.name}</Card.SubTitle>
        )}
        {isOngoing && <Card.Progressbar currentStep={currentStep} totalStepNumber={totalSteps} />}
        <Card.Text>{status.description} </Card.Text>
        {(isOngoing || isNotStarted) && (
          <Card.Button
            onClick={() => {
              navigation.navigate('Form', { caseId: caseData.id });
            }}
          >
            <Text>{isOngoing ? `Fortsätt ansökan` : `Starta ansökan`}</Text>
            <Icon name="arrow-forward" />
          </Card.Button>
        )}
        {isClosed && decision?.decisions && (
          <Card.Button onClick={toggleModal}>
            <Text>Visa beslut</Text>
            <Icon name="remove-red-eye" />
          </Card.Button>
        )}
      </Card.Body>
    </Card>
  );
};

/**
 * Case summary screen
 * @param {obj} props
 */
const CaseSummary = (props) => {
  const { cases, getCase } = useContext(CaseState);
  const { getForm } = useContext(FormContext);
  const [caseData, setCaseData] = useState({});
  const [form, setForm] = useState({});
  const {
    colorSchema,
    navigation,
    route: {
      params: { id: caseId },
    },
  } = props;
  const {
    details: {
      administrators,
      workflow: { decision = {}, payments = {}, calculations = {} } = {},
    } = {},
  } = caseData;
  const isFocused = useIsFocused();
  const [isModalVisible, toggleModal] = useModal();

  useEffect(() => {
    const caseData = getCase(caseId);
    setCaseData(caseData);

    const getFormObject = async (id) => {
      setForm(await getForm(id));
    };

    getFormObject(caseData.currentFormId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, cases]);

  const fadeAnimation = useRef(new Animated.Value(0)).current;
  console.log('calculations', calculations);
  console.log('decision', decision);
  console.log('payments', payments);

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      easing: Easing.back(),
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

  return (
    <ScreenWrapper {...props}>
      <Container as={Animated.ScrollView} style={{ opacity: fadeAnimation }}>
        <SummaryHeading type="h5">Aktuell period</SummaryHeading>
        {Object.keys(caseData).length > 0 &&
          computeCaseCardComponent(caseData, form, colorSchema, navigation, toggleModal)}

        {administrators && (
          <View>
            <SummaryHeading type="h5">Mina kontaktpersoner</SummaryHeading>
            {administrators.map(({ name, title, phone, email }) => (
              <Card key={`${name}`} colorSchema={colorSchema}>
                <Card.Body shadow color="neutral">
                  <Card.Section>
                    <Card.Image
                      style={{ width: 50, height: 50 }}
                      circle
                      source={icons.ICON_CONTACT_PERSON}
                    />
                    {title && <Card.SubTitle>{title}</Card.SubTitle>}
                    {name && <Card.Title colorSchema="neutral">{name}</Card.Title>}
                  </Card.Section>
                  {phone && (
                    <Card.Button colorSchema="neutral" onClick={() => launchPhone(phone)}>
                      <Icon name="phone" />
                      <Text>{phone}</Text>
                    </Card.Button>
                  )}
                  {email && (
                    <Card.Button colorSchema="neutral" onClick={() => launchEmail(email)}>
                      <Icon name="email" />
                      <Text>{email}</Text>
                    </Card.Button>
                  )}
                </Card.Body>
              </Card>
            ))}
          </View>
        )}
      </Container>

      <Modal visible={isModalVisible} hide={toggleModal}>
        <CloseModalButton
          onClose={toggleModal}
          primary={false}
          showBackButton={false}
          colorSchema="red"
        />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
          }}
        >
          <ModalContent>
            <SummaryHeading type="h5">Beslut</SummaryHeading>

            {decision?.decisions &&
              Object.keys(decision.decisions).length > 0 &&
              Object.keys(decision.decisions).map((key) => {
                const caseDecision = decision.decisions[key];
                return (
                  <Card key={key} colorSchema="red">
                    <Card.Body color="neutral" shadow>
                      <Card.Title colorSchema="neutral">{caseDecision.type}</Card.Title>
                      <Card.SubTitle>{caseDecision.causetext}</Card.SubTitle>
                      <Card.Text>{caseDecision.explanation}</Card.Text>
                    </Card.Body>
                  </Card>
                );
              })}

            {Object.keys(calculations).map((key) => {
              const calculation = calculations[key];
              return (
                <Card key={key} colorSchema="red">
                  <Card.Body shadow color="neutral">
                    <Card.Title colorSchema="neutral">Beräkning</Card.Title>
                    <Card.SubTitle>{`Beräkningsperiod: ${calculation.periodstartdate} - ${calculation.periodenddate} `}</Card.SubTitle>
                    <Card.CalculationRow>
                      <Card.Text>Totalt belopp enligt norm</Card.Text>
                      <Card.Text>{`-${calculation.normsum} kr`}</Card.Text>
                    </Card.CalculationRow>
                    <Card.CalculationRow>
                      <Card.Text>Utgifter</Card.Text>
                      <Card.Text>{`-${calculation.costsum} kr`}</Card.Text>
                    </Card.CalculationRow>
                    <Card.CalculationRow>
                      <Card.Text>Inkomster</Card.Text>
                      <Card.Text>{`${calculation.incomesum} kr`}</Card.Text>
                    </Card.CalculationRow>
                    <Card.CalculationRow>
                      <Card.Text>Reducering</Card.Text>
                      <Card.Text>{`${calculation.reductionsum} kr`}</Card.Text>
                    </Card.CalculationRow>
                    <Card.Separator />
                    <Card.CalculationRow>
                      <Card.Text strong>Summa (underskott)</Card.Text>
                      <Card.Text strong>{`${calculation.calculationsum} kr`}</Card.Text>
                    </Card.CalculationRow>
                  </Card.Body>
                </Card>
              );
            })}

            {Object.keys(payments).length > 0 && (
              <SummaryHeading type="h5">Utbetalningar</SummaryHeading>
            )}

            {Object.keys(payments).map((key) => {
              const payment = payments[key];
              return (
                <Card key={key} colorSchema="red">
                  <Card.Body shadow color="neutral">
                    <Card.Image source={icons.ICON_EKB_OUTLINE} />
                    <Card.Title colorSchema="neutral">{payment.givedate}</Card.Title>
                    <Card.SubTitle>Summa</Card.SubTitle>
                    <Card.Text>{`${payment.amount} kr`}</Card.Text>
                  </Card.Body>
                </Card>
              );
            })}
          </ModalContent>
          <ModalFooter>
            <Button z={0} block onClick={toggleModal} colorSchema="red">
              <Text>Stäng</Text>
            </Button>
          </ModalFooter>
        </ScrollView>
      </Modal>
    </ScreenWrapper>
  );
};

CaseSummary.propTypes = {
  colorSchema: PropTypes.string,
  route: PropTypes.object,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

CaseSummary.defaultProps = {
  colorSchema: 'red',
};

export default CaseSummary;
