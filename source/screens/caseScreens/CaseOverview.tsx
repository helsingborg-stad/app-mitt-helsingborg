import PropTypes from "prop-types";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Animated, Easing, RefreshControl } from "react-native";
import styled from "styled-components/native";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import { Modal } from "../../components/molecules/Modal";

import Wrapper from "../../components/molecules/Dialog/Wrapper";
import Heading from "../../components/atoms/Heading";
import { BackgroundBlur } from "../../components/atoms/BackgroundBlur";
import Body from "../../components/molecules/Dialog/Body";
import FloatingButton from "../../components/molecules/FloatingButton";
import Button from "../../components/atoms/Button";
import icons from "../../helpers/Icons";
import getUnapprovedCompletionDescriptions from "../../helpers/FormatCompletions";
import { Text, Icon } from "../../components/atoms";
import {
  Card,
  CaseCard,
  Header,
  ScreenWrapper,
} from "../../components/molecules";
import { getSwedishMonthNameByTimeStamp } from "../../helpers/DateHelpers";
import { CaseState, caseTypes, CaseDispatch } from "../../store/CaseContext";
import FormContext from "../../store/FormContext";
import { convertDataToArray, calculateSum } from "../../helpers/FormatVivaData";
import AuthContext from "../../store/AuthContext";
import { put } from "../../helpers/ApiRequest";
import {
  State as CaseContextState,
  Dispatch as CaseContextDispatch,
} from "../../types/CaseContext";
import { to, wait } from "../../helpers/Misc";
import { Case, ApplicationStatusType, AnsweredForm } from "../../types/Case";
import { Form } from "../../types/FormTypes";
import {
  answersAreEncrypted,
  getPasswordForForm,
} from "../../services/encryption/CaseEncryptionHelper";
import PinInputModal from "../../components/organisms/PinInputModal/PinInputModal";

const {
  ACTIVE_RANDOM_CHECK_REQUIRED_VIVA,
  ACTIVE_COMPLETION_REQUIRED_VIVA,
  ACTIVE_COMPLETION_SUBMITTED,
  ACTIVE_SIGNATURE_PENDING,
  NEW_APPLICATION,
  NOT_STARTED,
  ONGOING,
  SIGNED,
  CLOSED,
  ACTIVE,
} = ApplicationStatusType;

const ButtonContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 25px;
  width: 100%;
`;

const PopupButton = styled(Button)`
  border: 0;
  margin-bottom: 12px;
`;

const Container = styled.ScrollView`
  flex: 1;
  padding-left: 16px;
  padding-right: 16px;
`;

const DialogContainer = styled(Body)`
  text-align: center;
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

const StyledText = styled(Text)`
  margin-bottom: 8px;
`;

const ListHeading = styled(Text)`
  margin-left: 4px;
  margin-top: 24px;
  margin-bottom: 8px;
`;

const CardMessageBody = styled(Card.Body)`
  background-color: ${(props) => props.theme.colors.neutrals[5]};
`;

const colorSchema = "red";

const StyledIcon = styled(Icon)`
  color: ${(props) => props.theme.colors.primary[colorSchema][0]};
`;

/**
 * Returns a case card component depending on it's status
 * @param {obj} caseData
 * @param {obj} navigation
 * @param {obj} authContext
 * @param {object?} extra Extra properties
 * @param {function?} extra.dialogState
 */
const computeCaseCardComponent = (
  caseData,
  navigation,
  authContext,
  extra,
  onShowPinInput
) => {
  interface InternalCardProps {
    subtitle: string;
    description?: string;
    onClick: () => void;
  }

  interface InternalButtonProps {
    text: string;
    colorSchema: string | null;
    onClick: () => void;
  }

  const currentStep =
    caseData?.forms?.[caseData.currentFormId]?.currentPosition
      ?.currentMainStep || 0;
  const totalSteps = caseData.form?.stepStructure
    ? caseData.form.stepStructure.length
    : 0;
  const {
    details: {
      period = {},
      workflow: { decision = {}, payments = {}, application = {} } = {},
    } = {},
    persons = [],
  } = caseData;

  const applicationPeriodTimestamp =
    application?.periodenddate ?? period?.endDate;
  const applicationPeriodMonth = applicationPeriodTimestamp
    ? getSwedishMonthNameByTimeStamp(applicationPeriodTimestamp, true)
    : "";

  const decisions = decision?.decisions?.decision
    ? convertDataToArray(decision.decisions.decision)
    : [];

  const paymentsArray = decisions.filter(
    (decision) => decision.typecode === "01"
  );
  const partiallyApprovedDecisionsAndRejected = decisions.filter((decision) =>
    ["03", "02"].includes(decision.typecode)
  );

  const casePersonData = persons.find(
    (person) => person.personalNumber === authContext?.user?.personalNumber
  );

  const caseCoApplicantData = persons.find(
    ({ role }) => role === "coApplicant"
  );

  const completions = caseData?.details?.completions?.requested || [];
  const completionDuedate = caseData?.details?.completions?.dueDate
    ? moment(caseData?.details?.completions?.dueDate).format("YYYY-MM-DD")
    : "";

  const statusType = caseData?.status?.type || "";
  const isNotStarted = statusType.includes(NOT_STARTED);
  const isOngoing = statusType.includes(ONGOING);
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
  const isClosed = statusType.includes(CLOSED);
  const isWaitingForSign = statusType.includes(ACTIVE_SIGNATURE_PENDING);

  const unApprovedCompletionDescriptions: string[] = isVivaCompletionRequired
    ? getUnapprovedCompletionDescriptions(completions)
    : [];

  const selfHasSigned = casePersonData?.hasSigned;
  const isCoApplicant = casePersonData?.role === "coApplicant";

  const currentForm: AnsweredForm = caseData?.forms[caseData.currentFormId];
  const selfNeedsToConfirm = false;
  const isWaitingForCoApplicantConfirm = false;

  const isEncrypted = answersAreEncrypted(currentForm.answers);
  const shouldEnterPin = isEncrypted && isCoApplicant && isWaitingForSign;

  const shouldShowCTAButton =
    (!isEncrypted || shouldEnterPin) &&
    (isCoApplicant
      ? (isWaitingForSign && !selfHasSigned) ||
        (isWaitingForCoApplicantConfirm && selfNeedsToConfirm)
      : isOngoing ||
        isNotStarted ||
        isRandomCheckRequired ||
        isSigned ||
        isClosed ||
        isVivaCompletionRequired ||
        isCompletionSubmitted);
  const buttonProps: InternalButtonProps = {
    onClick: () => navigation.navigate("Form", { caseId: caseData.id }),
    text: "",
    colorSchema: null,
  };

  const cardProps: InternalCardProps = {
    subtitle: caseData.status.name,
    onClick: () => {
      navigation.navigate("UserEvents", {
        screen: caseData.caseType.navigateTo,
        params: {
          id: caseData.id,
          name: caseData.caseType.name,
        },
      });
    },
  };

  if (isClosed) {
    buttonProps.text = "Öppna";

    buttonProps.onClick = () => {
      navigation.navigate("UserEvents", {
        screen: caseData.caseType.navigateTo,
        params: {
          id: caseData.id,
          name: caseData.caseType.name,
        },
      });
    };
  }

  if (isOngoing) {
    buttonProps.text = "Fortsätt";
  }

  if (isNotStarted) {
    buttonProps.text = "Starta ansökan";

    if (isWaitingForCoApplicantConfirm) {
      cardProps.subtitle = "Väntar på bekräftelse";
      cardProps.description = `För att kunna starta ansökan behöver ${caseCoApplicantData?.firstName} installera Mitt Helsingborg på sin telefon.\n\nNär ${caseCoApplicantData?.firstName} har loggat in med BankID är bekräftelse gjord.\n`;
      buttonProps.colorSchema = "red";
      buttonProps.onClick = () => {
        if (extra && extra.setDialogState) {
          extra.setDialogState({
            ...extra.dialogState,
            showCoSignModal: true,
            caseData,
          });
        }
      };

      cardProps.onClick = () => undefined;

      if (selfNeedsToConfirm) {
        cardProps.subtitle = "Öppen";
        cardProps.description = "Din partner väntar på din bekräftelse";
        buttonProps.colorSchema = "red";
        buttonProps.text = "Bekräftar att jag söker ihop med någon";

        buttonProps.onClick = () => {
          if (extra && extra.setDialogState) {
            extra.setDialogState({
              ...extra.dialogState,
              showConfirmationThanksModal: true,
              caseData,
            });
          }
        };
      }
    }
  }

  if (isRandomCheckRequired) {
    buttonProps.text = "Starta stickprov";
  }

  if (isSigned) {
    buttonProps.text = "Ladda upp filer och dokument";
  }

  if (isWaitingForSign && !selfHasSigned) {
    buttonProps.onClick = () =>
      navigation.navigate("Form", { caseId: caseData.id, isSignMode: true });
    buttonProps.text = "Granska och signera";
  }

  if (isVivaCompletionRequired || isCompletionSubmitted) {
    buttonProps.text = "Komplettera ansökan";
  }

  const giveDate = payments?.payment?.givedate
    ? `${
        payments.payment.givedate.split("-")[2]
      } ${getSwedishMonthNameByTimeStamp(payments.payment.givedate, true)}`
    : undefined;

  if (caseData.password) {
    cardProps.description = `${cardProps.description ?? ""}pinkod: ${
      caseData.password
    }`;
  }
  if (shouldEnterPin) {
    buttonProps.onClick = onShowPinInput;
    buttonProps.text = "Ange pinkod";
    cardProps.onClick = undefined;
  }
  return (
    <CaseCard
      key={caseData.id}
      colorSchema={colorSchema}
      title={caseData.caseType.name}
      subtitle={cardProps.subtitle}
      largeSubtitle={applicationPeriodMonth}
      description={cardProps.description}
      icon={icons[caseData.caseType.icon]}
      showButton={shouldShowCTAButton}
      buttonText={buttonProps.text}
      currentStep={currentStep}
      totalSteps={totalSteps}
      showPayments={isClosed}
      showProgress={isOngoing}
      approvedAmount={calculateSum(paymentsArray)}
      declinedAmount={calculateSum(partiallyApprovedDecisionsAndRejected)}
      givedate={giveDate}
      onCardClick={cardProps.onClick}
      onButtonClick={buttonProps.onClick}
      buttonColorScheme={buttonProps.colorSchema || colorSchema}
      completions={unApprovedCompletionDescriptions}
      completionDuedate={completionDuedate}
    />
  );
};

interface CoSignDialogState {
  showCoSignModal: boolean;
  showConfirmationThanksModal: boolean;
  hasShownConfirmationThanksModal: boolean;
  caseData: Case | null;
}

interface CaseWithExtra extends Case {
  caseType: typeof caseTypes[0];
  form: Form;
  hasSymmetricKey: boolean;
  password: string;
}

/**
 * Case overview screen
 * @param {obj} props
 */
function CaseOverview(props): JSX.Element {
  const { navigation } = props;
  const [caseItems, setCaseItems] = useState<CaseWithExtra[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingCaseSign, setPendingCaseSign] = useState<Case | null>(null);
  const [pinModalCase, setPinModalCase] = useState<Case | null>(null);
  const [pinModalError, setPinModalError] = useState<string | null>(null);
  const [pinModalName, setPinModalName] = useState<string | null>(null);
  const { cases, getCasesByFormIds, fetchCases } = useContext(
    CaseState
  ) as Required<CaseContextState>;
  const { providePinForCase } = useContext<CaseContextDispatch>(CaseDispatch);
  const { getForm, getFormIdsByFormTypes } = useContext(FormContext);
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const [dialogState, setDialogState] = useState<CoSignDialogState>({
    showCoSignModal: false,
    showConfirmationThanksModal: false,
    hasShownConfirmationThanksModal: false,
    caseData: null,
  });

  const authContext = useContext(AuthContext);

  const getCasesByStatuses = (statuses: string[]) =>
    caseItems.filter((caseData) => {
      let matchesStatus = false;
      statuses.forEach((status) => {
        matchesStatus =
          matchesStatus || caseData?.status?.type?.includes(status);
      });
      return matchesStatus;
    });

  const activeCases = getCasesByStatuses([NOT_STARTED, ACTIVE]);
  const closedCases = getCasesByStatuses([CLOSED]);
  const newCase = getCasesByStatuses([NEW_APPLICATION])[0];

  const showActiveCases = activeCases.length > 0;
  const showClosedCases = closedCases.length > 0;

  const onFailedToFetchCases = (error: Error) => {
    console.error("failed to fetch cases", error);
  };

  const onRefresh = useCallback(() => {
    const extraDelay = 500;
    setRefreshing(true);
    void fetchCases()
      .then(() => wait(extraDelay))
      .catch(onFailedToFetchCases)
      .then(() => setRefreshing(false));
  }, [fetchCases]);

  useFocusEffect(
    useCallback(() => {
      if (authContext.user) {
        // Sometimes new cases is not created in an instant.
        // Due to this we have to give the api some time before we try to fetch cases,
        // since we cannot react to changes as of now.
        const delayBeforeFetch = 4000;
        wait(delayBeforeFetch).then(fetchCases).catch(onFailedToFetchCases);
      }
    }, [authContext.user, fetchCases])
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
          const formFromCase = caseData.forms[caseData.currentFormId];
          const hasSymmetricKey = !!formFromCase.encryption.symmetricKeyName;
          const password = hasSymmetricKey
            ? await getPasswordForForm(formFromCase, authContext.user)
            : null;
          const newCase: CaseWithExtra = {
            ...caseData,
            caseType,
            form,
            hasSymmetricKey,
            password,
          };
          return newCase;
        });
        return Promise.all(updatedFormCaseObjects);
      });

      await Promise.all(updateCaseItemsPromises).then((updatedItems) => {
        const flattenedList = updatedItems.flat();
        flattenedList.sort((caseA, caseB) => caseB.updatedAt - caseA.updatedAt);
        setCaseItems(flattenedList);
      });

      setIsLoading(false);
    };

    void updateItems();
  }, [cases, getCasesByFormIds, getForm, getFormIdsByFormTypes]);

  useEffect(() => {
    if (pendingCaseSign && authContext.status === "signResolved") {
      void (async () => {
        const currentForm =
          pendingCaseSign.forms[pendingCaseSign.currentFormId];

        const updateCaseRequestBody = {
          currentFormId: pendingCaseSign.currentFormId,
          ...currentForm,
          signature: { success: true },
        };

        try {
          const updateCaseResponse = await put(
            `/cases/${pendingCaseSign.id}`,
            JSON.stringify(updateCaseRequestBody)
          );

          if (updateCaseResponse.status !== 200) {
            throw new Error(
              `${updateCaseResponse.status} ${updateCaseResponse?.data?.data?.message}`
            );
          }

          setPendingCaseSign(null);
          onRefresh();

          // Show last screen of form
          navigation.navigate("Form", {
            caseId: pendingCaseSign.id,
          });
        } catch (error) {
          console.log(`Could not update case with new signature: ${error}`);
        }
      })();
    }
  }, [
    pendingCaseSign,
    authContext.status,
    setPendingCaseSign,
    onRefresh,
    navigation,
  ]);

  useEffect(() => {
    const coApplicantItemsToSign: CaseWithExtra[] = [];

    if (coApplicantItemsToSign.length > 0) {
      if (dialogState.hasShownConfirmationThanksModal) return;
      setDialogState({
        ...dialogState,
        showConfirmationThanksModal: true,
        caseData: coApplicantItemsToSign[0],
        hasShownConfirmationThanksModal: true,
      });
    }
  }, [authContext?.user?.personalNumber, caseItems, dialogState]);

  const showPinInput = (caseData: Case) => {
    const mainPerson = caseData.persons?.find(
      (person) => person.role === "applicant"
    );
    setPinModalName(mainPerson?.firstName ?? null);
    setPinModalCase(caseData);
  };

  const onClosePinModal = () => {
    setPinModalError(null);
    setPinModalCase(null);
  };

  const onEnteredPinForCase = async (pin: string) => {
    if (pinModalCase) {
      const [provideError] = await to(providePinForCase(pinModalCase, pin));
      if (provideError) {
        console.warn("provide pin error:", provideError);
        setPinModalError("Något blev fel");
      } else {
        setPinModalError(null);
        setPinModalCase(null);
        onRefresh();
      }
    }
  };
  const activeCaseCards = activeCases.map((caseData) =>
    computeCaseCardComponent(
      caseData,
      navigation,
      authContext,
      {
        dialogState,
        setDialogState,
      },
      () => showPinInput(caseData)
    )
  );

  const closedCaseCards = closedCases.map((caseData) =>
    computeCaseCardComponent(caseData, navigation, authContext, null, () =>
      showPinInput(caseData)
    )
  );

  const mainApplicantData = dialogState.caseData?.persons?.find(
    (person) => person.role === "applicant"
  );
  const coApplicantData = dialogState.caseData?.persons?.find(
    (person) => person.role === "coApplicant"
  );

  return (
    <ScreenWrapper {...props}>
      <Header title="Mina ärenden" />
      <PinInputModal
        name={pinModalName}
        visible={pinModalCase !== null}
        onClose={onClosePinModal}
        onPinEntered={onEnteredPinForCase}
        error={pinModalError}
      />
      <Modal
        visible={dialogState.showCoSignModal}
        hide={() =>
          setDialogState({
            ...dialogState,
            showCoSignModal: false,
          })
        }
        transparent
        presentationStyle="overFullScreen"
        animationType="fade"
        statusBarTranslucent
      >
        <Wrapper>
          <DialogContainer>
            <Heading type="h4">Bekräftelse behövs</Heading>
            <Text align="center">
              {"\n"}För att kunna starta ansökan måste{" "}
              {coApplicantData?.firstName} bekräfta att ni söker tillsammans.
              {"\n\n"}Bekräfta så här:{"\n\n"}
              1. {coApplicantData?.firstName} installerar Mitt Helsingborg på
              sin telefon.{"\n"}
              2. {coApplicantData?.firstName} loggar in med sitt BankID i appen.
              {"\n"}
              3. När {coApplicantData?.firstName} har loggat in är bekräftelse
              gjord och det går att starta ansökan.{"\n"}
            </Text>
            <ButtonContainer>
              <PopupButton
                onClick={() =>
                  setDialogState({
                    ...dialogState,
                    showCoSignModal: false,
                  })
                }
                block
                colorSchema="red"
              >
                <Text>Okej</Text>
              </PopupButton>
            </ButtonContainer>
          </DialogContainer>
          <BackgroundBlur
            blurType="light"
            blurAmount={15}
            reducedTransparencyFallbackColor="white"
          />
        </Wrapper>
      </Modal>
      <Modal
        visible={dialogState.showConfirmationThanksModal}
        hide={() =>
          setDialogState({
            ...dialogState,
            showConfirmationThanksModal: false,
          })
        }
        transparent
        presentationStyle="overFullScreen"
        animationType="fade"
        statusBarTranslucent
      >
        <Wrapper>
          <DialogContainer>
            <Heading type="h4">Tack, för din bekräftelse!</Heading>
            <StyledText align="center">
              Genom att logga in har du bekräftat att du och{" "}
              {mainApplicantData?.firstName} söker ekonomiskt bistånd
              tillsammans.
            </StyledText>
            <Text align="center">
              {mainApplicantData?.firstName} kan nu starta ansökan.
            </Text>
            <ButtonContainer>
              <PopupButton
                onClick={() =>
                  setDialogState({
                    ...dialogState,
                    showConfirmationThanksModal: false,
                  })
                }
                block
                colorSchema="red"
              >
                <Text>Okej</Text>
              </PopupButton>
            </ButtonContainer>
          </DialogContainer>
          <BackgroundBlur
            blurType="light"
            blurAmount={15}
            reducedTransparencyFallbackColor="white"
          />
        </Wrapper>
      </Modal>
      <Container
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {(showActiveCases || showClosedCases) && !isLoading && (
          <Card.Button colorSchema="red" disabled>
            <Icon name={refreshing ? "refresh" : "arrow-downward"} />
            <Text>Dra för att ladda om sidan</Text>
          </Card.Button>
        )}

        {!isLoading && activeCases.length === 0 && closedCases.length === 0 && (
          <>
            <Card colorSchema="red">
              <Card.Body colorSchema="red">
                <Card.Text align="center">
                  <StyledIcon
                    name={refreshing ? "refresh" : "arrow-downward"}
                    size={32}
                  />
                </Card.Text>
                <Card.Title align="center">Här var det tomt!</Card.Title>
                <Card.Text align="center" colorSchema="red">
                  Dra för att ladda om sidan om det borde finnas något här.
                </Card.Text>
              </Card.Body>
            </Card>

            {newCase && (
              <Card colorSchema="red">
                <Card.Body colorSchema="red">
                  <Card.Text align="center" colorSchema="red">
                    ... eller tryck på knappen för att ansöka för första gången.
                  </Card.Text>
                </Card.Body>
              </Card>
            )}
          </>
        )}

        {showActiveCases && (
          <>
            <ListHeading type="h5">Aktiva</ListHeading>
            <Animated.View style={{ opacity: fadeAnimation }}>
              {activeCaseCards}
            </Animated.View>
          </>
        )}

        {showClosedCases && (
          <Animated.View style={{ opacity: fadeAnimation }}>
            <ListHeading type="h5">Avslutade</ListHeading>
            {closedCaseCards}
          </Animated.View>
        )}
      </Container>

      {newCase && (
        <FloatingButton
          onPress={() => navigation.navigate("Form", { caseId: newCase.id })}
          text="Ansök om ekonomiskt bistånd"
          iconName="account-balance-wallet"
          position="center"
          buttonWidth="90%"
        />
      )}
    </ScreenWrapper>
  );
}

CaseOverview.propTypes = {
  navigation: PropTypes.any,
};

export default CaseOverview;
