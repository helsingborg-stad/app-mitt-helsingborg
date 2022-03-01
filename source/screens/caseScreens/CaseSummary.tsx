import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { View, Animated, Easing, ScrollView } from "react-native";
import PropTypes from "prop-types";
import styled from "styled-components/native";
import { useIsFocused } from "@react-navigation/native";
import { CaseState } from "../../store/CaseContext";
import FormContext from "../../store/FormContext";
import icons from "../../helpers/Icons";
import { launchPhone, launchEmail } from "../../helpers/LaunchExternalApp";
import { getSwedishMonthNameByTimeStamp } from "../../helpers/DateHelpers";
import getUnapprovedCompletionDescriptions from "../../helpers/FormatCompletions";
import { Icon, Text } from "../../components/atoms";
import {
  Card,
  HelpButton,
  ScreenWrapper,
  CaseCard,
} from "../../components/molecules";
import { Modal, useModal } from "../../components/molecules/Modal";
import BackNavigation from "../../components/molecules/BackNavigation";
import Button from "../../components/atoms/Button";
import {
  formatAmount,
  convertDataToArray,
  calculateSum,
} from "../../helpers/FormatVivaData";
import AuthContext from "../../store/AuthContext";
import { put } from "../../helpers/ApiRequest";
import { ApplicationStatusType } from "../../types/Case";

const {
  NOT_STARTED,
  ONGOING,
  CLOSED,
  SIGNED,
  ACTIVE_SIGNATURE_PENDING,
  ACTIVE_COMPLETION_REQUIRED_VIVA,
  ACTIVE_RANDOM_CHECK_REQUIRED_VIVA,
  ACTIVE_COMPLETION_SUBMITTED,
} = ApplicationStatusType;

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
  margin-bottom: 16px;
`;

const computeCaseCardComponent = (
  caseData,
  form,
  formName,
  colorSchema,
  navigation,
  toggleModal,
  authContext
) => {
  const {
    currentPosition: { currentMainStep: currentStep },
  } = caseData.forms[caseData.currentFormId];
  const {
    status,
    details: {
      period = {},
      workflow: {
        decision = {},
        payments = {},
        application = {},
        journals = {},
      } = {},
    } = {},
    persons = [],
  } = caseData;

  const totalSteps = form?.stepStructure?.length || 0;

  const completions = caseData?.details?.completions?.requested || [];

  const applicationPeriodTimestamp =
    application?.periodenddate ?? period?.endDate;
  const applicationPeriodMonth = applicationPeriodTimestamp
    ? getSwedishMonthNameByTimeStamp(applicationPeriodTimestamp, true)
    : "";

  const casePersonData = persons.find(
    (person) => person.personalNumber === authContext.user.personalNumber
  );

  const statusType = status?.type;

  const isNotStarted = statusType.includes(NOT_STARTED);
  const isOngoing = statusType.includes(ONGOING);
  const isClosed = statusType.includes(CLOSED);
  const isRandomCheckRequired = statusType.includes(
    ACTIVE_RANDOM_CHECK_REQUIRED_VIVA
  );
  const isVivaCompletionRequired = statusType.includes(
    ACTIVE_COMPLETION_REQUIRED_VIVA
  );
  const isCompletionSubmitted = statusType.includes(
    ACTIVE_COMPLETION_SUBMITTED
  );
  const isSigned = statusType.includes(SIGNED);
  const isWaitingForSign = statusType.includes(ACTIVE_SIGNATURE_PENDING);
  const selfHasSigned = casePersonData?.hasSigned;
  const isCoApplicant = casePersonData?.role === "coApplicant";

  const decisions = decision?.decisions?.decision
    ? convertDataToArray(decision.decisions.decision)
    : [];

  const paymentsArray = decisions.filter(
    (decision) => decision.typecode === "01"
  );
  const partiallyApprovedDecisionsAndRejected = decisions.filter((decision) =>
    ["03", "02"].includes(decision.typecode)
  );

  const shouldShowCTAButton = isCoApplicant
    ? isWaitingForSign && !selfHasSigned
    : isOngoing ||
      isNotStarted ||
      isRandomCheckRequired ||
      isSigned ||
      isVivaCompletionRequired ||
      isCompletionSubmitted;

  const buttonProps = {
    onClick: () => navigation.navigate("Form", { caseId: caseData.id }),
    text: "",
  };

  if (isOngoing) {
    buttonProps.text = "Fortsätt";
  }

  if (isNotStarted) {
    buttonProps.text = "Starta ansökan";
  }

  if (isRandomCheckRequired) {
    buttonProps.text = "Starta stickprov";
  }

  if (isVivaCompletionRequired || isCompletionSubmitted) {
    buttonProps.text = "Komplettera ansökan";
  }

  if (isSigned) {
    buttonProps.text = "Ladda upp filer och dokument";
  }

  if (isClosed) {
    buttonProps.text = "Visa beslut";
  }

  if (isWaitingForSign && !selfHasSigned) {
    buttonProps.onClick = () =>
      navigation.navigate("Form", { caseId: caseData.id, isSignMode: true });
    buttonProps.text = "Granska och signera";
  }

  const giveDate = payments?.payment?.givedate
    ? `${
        payments.payment.givedate.split("-")[2]
      } ${getSwedishMonthNameByTimeStamp(payments.payment.givedate, true)}`
    : null;

  const unApprovedCompletionDescriptions: string[] =
    isVivaCompletionRequired || isCompletionSubmitted
      ? getUnapprovedCompletionDescriptions(completions)
      : [];

  const completionDuedate =
    caseData?.details?.workflow?.application?.completionduedate || "";

  return (
    <CaseCard
      colorSchema={colorSchema}
      title={applicationPeriodMonth || formName}
      subtitle={status.name}
      showProgress={isOngoing}
      currentStep={currentStep}
      totalSteps={totalSteps}
      description={status.description}
      showPayments={isClosed && !!payments?.payment?.givedate}
      approvedAmount={calculateSum(paymentsArray, "kronor")}
      givedate={giveDate}
      declinedAmount={calculateSum(
        partiallyApprovedDecisionsAndRejected,
        "kronor"
      )}
      showButton={isClosed || shouldShowCTAButton}
      buttonText={buttonProps.text}
      onButtonClick={isClosed ? toggleModal : buttonProps.onClick}
      buttonIconName={isClosed ? "remove-red-eye" : "arrow-forward"}
      completions={unApprovedCompletionDescriptions}
      completionDuedate={completionDuedate}
    />
  );
};

/**
 * Case summary screen
 * @param {obj} props
 */
const CaseSummary = (props) => {
  const authContext = useContext(AuthContext);
  const { cases, getCase } = useContext(CaseState);
  const { getForm } = useContext(FormContext);
  const [caseData, setCaseData] = useState({});
  const [form, setForm] = useState({});

  const {
    colorSchema,
    navigation,
    route: {
      params: { id: caseId, name: formName },
    },
  } = props;

  const {
    details: {
      administrators,
      workflow: { decision = {}, calculations = {}, journals = {} } = {},
    } = {},
  } = caseData;

  const isFocused = useIsFocused();
  const [isModalVisible, toggleModal] = useModal();
  const [isCalculationDetailsVisible, setCalculationDetailsVisibility] =
    useState(false);
  const decisions = decision?.decisions?.decision
    ? convertDataToArray(decision.decisions.decision)
    : [];

  useEffect(() => {
    const caseData = getCase(caseId);
    setCaseData(caseData);

    const getFormObject = async (id) => {
      setForm(await getForm(id));
    };

    getFormObject(caseData.currentFormId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, cases]);

  const updateCaseSignature = useCallback(
    async (caseItem, signatureSuccessful) => {
      const currentForm = caseItem.forms[caseItem.currentFormId];

      const updateCaseRequestBody = {
        currentFormId: caseItem.currentFormId,
        ...currentForm,
        signature: { success: signatureSuccessful },
      };

      try {
        const updateCaseResponse = await put(
          `/cases/${caseItem.id}`,
          JSON.stringify(updateCaseRequestBody)
        );

        if (updateCaseResponse.status !== 200) {
          throw new Error(
            `${updateCaseResponse.status} ${updateCaseResponse?.data?.data?.message}`
          );
        }

        // Show last screen of form
        navigation.navigate("Form", {
          caseId: caseItem.id,
        });
        return updateCaseResponse;
      } catch (error) {
        console.log(`Could not update case with new signature: ${error}`);
      }
    },
    [navigation]
  );

  useEffect(() => {
    const updateCaseAfterSignature = async () => {
      if (authContext.status === "signResolved") {
        const userCase = getCase(caseId);
        await updateCaseSignature(userCase, true);
      }
    };

    updateCaseAfterSignature();
  }, [updateCaseSignature, authContext.status, caseId, getCase]);

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
          computeCaseCardComponent(
            caseData,
            form,
            formName,
            colorSchema,
            navigation,
            toggleModal,
            authContext
          )}

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
                    {name && (
                      <Card.Title colorSchema="neutral">{name}</Card.Title>
                    )}
                  </Card.Section>
                  {phone && (
                    <Card.Button
                      colorSchema="neutral"
                      onClick={() => launchPhone(phone)}
                    >
                      <Icon name="phone" />
                      <Text>{phone}</Text>
                    </Card.Button>
                  )}
                  {email && (
                    <Card.Button
                      colorSchema="neutral"
                      onClick={() => launchEmail(email)}
                    >
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
            justifyContent: "space-between",
          }}
        >
          <ModalContent>
            <SummaryHeading type="h5">Beslut</SummaryHeading>

            {decisions.map((caseDecision, index) => (
              <Card key={index} colorSchema="red">
                <Card.Body color="neutral" shadow>
                  <Card.Title colorSchema="neutral">
                    {caseDecision.type}
                  </Card.Title>
                  <Card.Text>{caseDecision.explanation}</Card.Text>
                </Card.Body>
              </Card>
            ))}

            {Object.keys(calculations).map((key) => {
              const calculation = calculations[key];
              return (
                <Card key={key} colorSchema="red">
                  <Card.Body color="neutral">
                    <Card.Title colorSchema="neutral">Beräkning</Card.Title>
                    {calculation.periodstartdate &&
                      calculation.periodenddate && (
                        <Card.Text>{`Period: ${calculation.periodstartdate} - ${calculation.periodenddate} `}</Card.Text>
                      )}
                    <Card.CalculationRow>
                      <Card.Text strong>Inkomster</Card.Text>
                      <Card.Text>
                        {formatAmount(calculation.incomesum)}
                      </Card.Text>
                    </Card.CalculationRow>
                    <Card.CalculationRow>
                      <Card.Text strong>Utgifter</Card.Text>
                      <Card.Text>
                        {formatAmount(calculation.costsum, true)}
                      </Card.Text>
                    </Card.CalculationRow>
                    <Card.CalculationRow>
                      <Card.Text strong>Belopp enligt norm</Card.Text>
                      <Card.Text>
                        {formatAmount(calculation.normsubtotal, true)}
                      </Card.Text>
                    </Card.CalculationRow>
                    <Card.CalculationRow>
                      <Card.Text strong>Reducering</Card.Text>
                      <Card.Text>
                        <Card.Text>
                          {formatAmount(calculation.reductionsum)}
                        </Card.Text>
                      </Card.Text>
                    </Card.CalculationRow>
                    <Card.CalculationRow>
                      <Card.Text strong>Summa</Card.Text>
                      <Card.Text strong>
                        {formatAmount(calculation.calculationsum)}
                      </Card.Text>
                    </Card.CalculationRow>

                    <Card.Button
                      colorSchema="neutral"
                      onClick={() =>
                        setCalculationDetailsVisibility(
                          !isCalculationDetailsVisible
                        )
                      }
                    >
                      <Text>Detaljer</Text>
                      <Icon
                        name={
                          isCalculationDetailsVisible
                            ? "keyboard-arrow-up"
                            : "keyboard-arrow-down"
                        }
                      />
                    </Card.Button>
                    {isCalculationDetailsVisible && (
                      <>
                        <Card.DetailsTitle type="h6">
                          Personer som påverkar normen
                        </Card.DetailsTitle>
                        {calculation?.calculationpersons?.calculationperson &&
                          convertDataToArray(
                            calculation?.calculationpersons?.calculationperson
                          ).map((person, index) => (
                            <Card
                              key={`${index}-${person?.name}`}
                              colorSchema="neutral"
                            >
                              <Card.Title colorSchema="neutral" strong>
                                {person?.name}
                              </Card.Title>
                              <Card.SubTitle colorSchema="neutral" strong>
                                {person?.pnumber}
                              </Card.SubTitle>
                              <Card.Text>
                                Norm beräknad på {person?.days} dagar
                              </Card.Text>
                            </Card>
                          ))}

                        <Text strong type="h6">
                          Detaljerad beräkning
                        </Text>

                        <Card.DetailsTitle type="h5">
                          Inkomster
                        </Card.DetailsTitle>
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
                                <Card.CalculationRowCell />
                              </Card.CalculationRowHeader>

                              {convertDataToArray(
                                calculation?.incomes?.income
                              ).map((income, index) => (
                                <Card.CalculationRow
                                  key={`${index}-${income?.type}`}
                                >
                                  <Card.CalculationRowCell>
                                    <Text>{income?.type}</Text>
                                  </Card.CalculationRowCell>
                                  <Card.CalculationRowCell>
                                    <Text>{income?.amount} kr</Text>
                                  </Card.CalculationRowCell>
                                  <Card.CalculationRowCell>
                                    {income.note ? (
                                      <HelpButton
                                        text={income.note}
                                        heading={income.type}
                                        tagline=""
                                        icon="info"
                                      />
                                    ) : null}
                                  </Card.CalculationRowCell>
                                </Card.CalculationRow>
                              ))}
                            </Card.CalculationTable>
                          </>
                        ) : (
                          <Card.Text italic>
                            Det finns inga registrerade inkomster.
                          </Card.Text>
                        )}

                        <Card.DetailsTitle type="h5">
                          Utgifter
                        </Card.DetailsTitle>
                        {calculation?.costs?.cost ? (
                          <>
                            <Card.CalculationTable>
                              <Card.CalculationRowHeader>
                                <Card.CalculationRowCell />
                                <Card.CalculationRowCell>
                                  <Text strong>Ansökt</Text>
                                </Card.CalculationRowCell>
                                <Card.CalculationRowCell>
                                  <Text strong>Godkänt</Text>
                                </Card.CalculationRowCell>
                                <Card.CalculationRowCell />
                              </Card.CalculationRowHeader>
                              {convertDataToArray(calculation?.costs?.cost).map(
                                (cost, index) => (
                                  <Card.CalculationRow
                                    key={`${index}-${cost.type}`}
                                  >
                                    <Card.CalculationRowCell>
                                      <Text>{cost?.type}</Text>
                                    </Card.CalculationRowCell>
                                    <Card.CalculationRowCell>
                                      <Text>{formatAmount(cost.actual)}</Text>
                                    </Card.CalculationRowCell>
                                    <Card.CalculationRowCell>
                                      <Text>{formatAmount(cost.approved)}</Text>
                                    </Card.CalculationRowCell>
                                    <Card.CalculationRowCell>
                                      {cost.note ? (
                                        <HelpButton
                                          text={cost.note}
                                          heading={cost.type}
                                          tagline=""
                                          icon="info"
                                        />
                                      ) : null}
                                    </Card.CalculationRowCell>
                                  </Card.CalculationRow>
                                )
                              )}
                            </Card.CalculationTable>
                          </>
                        ) : (
                          <Card.Text italic>
                            Det finns inga registrerade utgifter.
                          </Card.Text>
                        )}

                        <Card.DetailsTitle type="h5">
                          Belopp enligt norm
                        </Card.DetailsTitle>

                        {calculation?.norm?.normpart ? (
                          <>
                            {calculation?.norm?.normpart?.map(
                              (normpart, index) => (
                                <Card.CalculationRow
                                  key={`${index}-${normpart.type}`}
                                >
                                  <Card.CalculationRowCell>
                                    <Text>{normpart?.type}</Text>
                                  </Card.CalculationRowCell>
                                  <Card.CalculationRowCell />
                                  <Card.CalculationRowCell>
                                    <Text>{formatAmount(normpart.amount)}</Text>
                                  </Card.CalculationRowCell>
                                </Card.CalculationRow>
                              )
                            )}
                          </>
                        ) : (
                          <Card.Text italic>
                            Det finns inga registrerade normer.
                          </Card.Text>
                        )}

                        <Card.DetailsTitle type="h5">
                          Reducering
                        </Card.DetailsTitle>
                        {calculation?.reductions?.reduction ? (
                          <>
                            {convertDataToArray(
                              calculation?.reductions?.reduction
                            ).map((reduction, index) => (
                              <Card.CalculationRow
                                key={`${index}-${reduction.type}`}
                              >
                                <Card.CalculationRowCell>
                                  <Text>{reduction?.type}</Text>
                                </Card.CalculationRowCell>
                                <Card.CalculationRowCell>
                                  <Text>
                                    {reduction?.days}{" "}
                                    {reduction?.days > 1 ? "dagar" : "dag"}
                                  </Text>
                                </Card.CalculationRowCell>
                                <Card.CalculationRowCell>
                                  <Text>{reduction?.note}</Text>
                                </Card.CalculationRowCell>
                                <Card.CalculationRowCell>
                                  <Text>{formatAmount(reduction.amount)}</Text>
                                </Card.CalculationRowCell>
                              </Card.CalculationRow>
                            ))}
                          </>
                        ) : (
                          <Card.Text italic>
                            Det finns inga registrerade reduceringar.
                          </Card.Text>
                        )}

                        <Card.CalculationRow>
                          <Card.Text strong>Summa</Card.Text>
                          <Card.Text strong>
                            {formatAmount(calculation.calculationsum)}
                          </Card.Text>
                        </Card.CalculationRow>
                      </>
                    )}
                  </Card.Body>
                </Card>
              );
            })}

            {journals?.journal?.notes?.note?.length > 0 && (
              <Card>
                <Card.Body color="neutral">
                  <Card.Title colorSchema="neutral">Anteckningar</Card.Title>
                  {journals.journal.notes.note.map((note) => (
                    <View key={`journal-${note.label}`}>
                      <Text type="h3">{note.label}</Text>
                      <Card.Text>{note.text}</Card.Text>
                    </View>
                  ))}
                </Card.Body>
              </Card>
            )}
          </ModalContent>
          <ModalFooter>
            <Button z={0} block onClick={toggleModal} colorSchema="neutral">
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
  colorSchema: "red",
};

export default CaseSummary;
