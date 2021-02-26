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
  margin: 16px;
  margin-top: 32px;
`;

const ModalFooter = styled.View`
  margin: 16px;
  margin-bottom: 32px;
  justify-content: center;
  align-items: center;
`;

Card.CalculationTable = styled.View`
  flex: 1;
  margin-top: 8px;
  border: 1px solid ${(props) => props.theme.colors.complementary.neutral[1]};
  border-radius: 5px;
  padding-bottom: 8px;
`;

Card.CalculationRow = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

Card.CalculationRowHeader = styled(Card.CalculationRow)`
  padding: 4px 0px;
  margin-bottom: 8px;
  border-radius: 5px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  background-color: ${(props) => props.theme.colors.neutrals[5]};
`;

Card.CalculationRowCell = styled.View`
  flex: 1;
  align-self: stretch;
  padding-left: 8px;
  padding-right: 8px;
`;

Card.Separator = styled.View`
  height: 2px;
  width: 100%;
  border-radius: 50px;
  margin-top: 16px;
  margin-bottom: 16px;
  background-color: ${(props) => props.theme.colors.complementary.neutral[1]};
`;

Card.DetailsTitle = styled(Text)`
  margin-top: 16px;
  margin-bottom: 8px;
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
  const [isCalculationDetailsVisible, setCalculationDetailsVisibility] = useState(false);

  const convertDataToArray = (data) => (Array.isArray(data) ? data : [data]);
  const formatCost = (cost) => (cost === '0' ? cost : `-${cost.replace('-', '')}`);

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

        {Object.keys(payments).length > 0 && (
          <SummaryHeading type="h5">Utbetalningar</SummaryHeading>
        )}

        {Object.keys(payments).map((key) => {
          const payment = payments[key];
          return (
            <Card key={key} colorSchema="red">
              <Card.Body shadow color="neutral">
                <Card.Image source={icons.ICON_EKB_OUTLINE} />
                <Card.Title colorSchema="neutral">{`${payment.amount} kr`}</Card.Title>
                <Card.SubTitle>Utbetalas</Card.SubTitle>
                <Card.Text>{payment.givedate}</Card.Text>
              </Card.Body>
            </Card>
          );
        })}

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
                  <Card.Body color="neutral" shadow>
                    <Card.Title colorSchema="neutral">Beräkning</Card.Title>
                    <Card.SubTitle>{`Beräkningsperiod: ${calculation.periodstartdate} - ${calculation.periodenddate} `}</Card.SubTitle>
                    <Card.Separator />
                    <Card.CalculationRow>
                      <Card.Text>Totalt belopp enligt norm</Card.Text>
                      <Card.Text>{`${formatCost(calculation.normsum)} kr`}</Card.Text>
                    </Card.CalculationRow>
                    <Card.CalculationRow>
                      <Card.Text>Utgifter</Card.Text>
                      <Card.Text>{`${formatCost(calculation.costsum)} kr`}</Card.Text>
                    </Card.CalculationRow>
                    <Card.CalculationRow>
                      <Card.Text>Inkomster</Card.Text>
                      <Card.Text>{`${calculation.incomesum} kr`}</Card.Text>
                    </Card.CalculationRow>
                    <Card.CalculationRow>
                      <Card.Text>Reducering</Card.Text>
                      <Card.Text>{`${calculation.reductionsum} kr`}</Card.Text>
                    </Card.CalculationRow>
                    <Card.CalculationRow>
                      <Card.Text strong>Summa (underskott)</Card.Text>
                      <Card.Text strong>{`${calculation.calculationsum} kr`}</Card.Text>
                    </Card.CalculationRow>

                    <Card.Button
                      colorSchema="neutral"
                      onClick={() => setCalculationDetailsVisibility(!isCalculationDetailsVisible)}
                    >
                      <Text>Detaljer</Text>
                      <Icon
                        name={
                          isCalculationDetailsVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
                        }
                      />
                    </Card.Button>
                    {isCalculationDetailsVisible && (
                      <>
                        <Card.DetailsTitle type="h5">
                          Personer som påverkar normen
                        </Card.DetailsTitle>
                        {calculation?.calculationpersons?.calculationperson &&
                          convertDataToArray(
                            calculation?.calculationpersons?.calculationperson
                          ).map((person, index) => (
                            <Card key={`${index}-${person?.name}`} colorSchema="red">
                              <Card.Body shadow color="neutral">
                                <Card.Section>
                                  <Card.Image
                                    style={{ width: 50, height: 50 }}
                                    circle
                                    source={icons.ICON_CONTACT_PERSON}
                                  />
                                  <Card.SubTitle>Namn</Card.SubTitle>
                                  <Card.Title colorSchema="neutral">{person?.name}</Card.Title>
                                </Card.Section>
                                <Card.CalculationTable>
                                  <Card.CalculationRowHeader>
                                    <Card.CalculationRowCell>
                                      <Text strong>Med i norm</Text>
                                    </Card.CalculationRowCell>
                                    <Card.CalculationRowCell>
                                      <Text strong>Dagar</Text>
                                    </Card.CalculationRowCell>
                                    <Card.CalculationRowCell>
                                      <Text strong>Hushåll</Text>
                                    </Card.CalculationRowCell>
                                  </Card.CalculationRowHeader>
                                  <Card.CalculationRow>
                                    <Card.CalculationRowCell>
                                      <Text>{person?.norm}</Text>
                                    </Card.CalculationRowCell>
                                    <Card.CalculationRowCell>
                                      <Text>{person?.days}</Text>
                                    </Card.CalculationRowCell>
                                    <Card.CalculationRowCell>
                                      <Text>{person?.home}</Text>
                                    </Card.CalculationRowCell>
                                  </Card.CalculationRow>
                                </Card.CalculationTable>
                              </Card.Body>
                            </Card>
                          ))}

                        <Card.DetailsTitle type="h5">Utgifter</Card.DetailsTitle>
                        {calculation?.costs?.cost ? (
                          <>
                            <Card.CalculationTable>
                              <Card.CalculationRowHeader>
                                <Card.CalculationRowCell>
                                  <Text strong>Utgift</Text>
                                </Card.CalculationRowCell>
                                <Card.CalculationRowCell>
                                  <Text strong>Faktiska</Text>
                                </Card.CalculationRowCell>
                                <Card.CalculationRowCell>
                                  <Text strong>Godkända</Text>
                                </Card.CalculationRowCell>
                              </Card.CalculationRowHeader>

                              {convertDataToArray(calculation?.costs?.cost).map((cost, index) => (
                                <Card.CalculationRow key={`${index}-${cost.type}`}>
                                  <Card.CalculationRowCell>
                                    <Text>{cost?.type}</Text>
                                  </Card.CalculationRowCell>
                                  <Card.CalculationRowCell>
                                    <Text>{cost?.actual} kr</Text>
                                  </Card.CalculationRowCell>
                                  <Card.CalculationRowCell>
                                    <Text>{cost?.approved} kr</Text>
                                  </Card.CalculationRowCell>
                                </Card.CalculationRow>
                              ))}
                            </Card.CalculationTable>
                            <Card.CalculationRow>
                              <Card.Text strong>Summa</Card.Text>
                              <Card.Text strong>
                                {`${convertDataToArray(calculation?.costs?.cost).reduce(
                                  (acc, obj) => acc + parseInt(obj.approved),
                                  0
                                )} kr`}
                              </Card.Text>
                            </Card.CalculationRow>
                          </>
                        ) : (
                          <Card.Text italic>Det finns inga registrerade utgifter.</Card.Text>
                        )}

                        <Card.DetailsTitle type="h5">Inkomster</Card.DetailsTitle>
                        {calculation?.incomes?.income ? (
                          <>
                            <Card.CalculationTable>
                              <Card.CalculationRowHeader>
                                <Card.CalculationRowCell>
                                  <Text strong>Inkomst</Text>
                                </Card.CalculationRowCell>
                                <Card.CalculationRowCell>
                                  <Text strong>Summa</Text>
                                </Card.CalculationRowCell>
                              </Card.CalculationRowHeader>

                              {convertDataToArray(calculation?.incomes?.income).map(
                                (income, index) => (
                                  <Card.CalculationRow key={`${index}-${income?.type}`}>
                                    <Card.CalculationRowCell>
                                      <Text>{income?.type}</Text>
                                    </Card.CalculationRowCell>
                                    <Card.CalculationRowCell>
                                      <Text>{income?.amount} kr</Text>
                                    </Card.CalculationRowCell>
                                  </Card.CalculationRow>
                                )
                              )}
                            </Card.CalculationTable>
                            <Card.CalculationRow>
                              <Card.Text strong>Summa</Card.Text>
                              <Card.Text strong>
                                {`${convertDataToArray(calculation?.incomes?.income).reduce(
                                  (acc, obj) => acc + parseInt(obj.amount),
                                  0
                                )} kr`}
                              </Card.Text>
                            </Card.CalculationRow>
                          </>
                        ) : (
                          <Card.Text italic>Det finns inga registrerade inkomster.</Card.Text>
                        )}
                      </>
                    )}
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
