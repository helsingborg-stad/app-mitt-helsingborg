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
import { hasGeneratedSymmetricKey } from "../../services/encryption/EncryptionService";
import { Modal } from "../../components/molecules/Modal";

import Wrapper from "../../components/molecules/Dialog/Wrapper";
import Heading from "../../components/atoms/Heading";
import Body from "../../components/molecules/Dialog/Body";
import BackgroundBlur from "../../components/molecules/Dialog/BackgroundBlur";
import Button from "../../components/atoms/Button";
import icons from "../../helpers/Icons";
import { Text, Icon } from "../../components/atoms";
import {
  Card,
  CaseCard,
  Header,
  ScreenWrapper,
} from "../../components/molecules";
import { getSwedishMonthNameByTimeStamp } from "../../helpers/DateHelpers";
import { CaseState, caseTypes } from "../../store/CaseContext";
import FormContext from "../../store/FormContext";
import { convertDataToArray, calculateSum } from "../../helpers/FormatVivaData";
import AuthContext from "../../store/AuthContext";
import { put } from "../../helpers/ApiRequest";
import { State as CaseContextState } from "../../types/CaseContext";
import { wait } from "../../helpers/Misc";
import { Case } from "../../types/Case";
import { Form } from "../../types/FormTypes";

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
const computeCaseCardComponent = (caseData, navigation, authContext, extra) => {
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
    (person) => person.personalNumber === authContext.user.personalNumber
  );

  const statusType = caseData?.status?.type || "";
  const isNotStarted = statusType.includes("notStarted");
  const isOngoing = statusType.includes("ongoing");
  const isCompletionRequired = statusType.includes("completionRequired");
  const isSigned = statusType.includes("signed");
  const isClosed = statusType.includes("closed");
  const isWaitingForSign = statusType.includes("active:signature:pending");
  const selfHasSigned = casePersonData?.hasSigned;
  const isCoApplicant = casePersonData?.role === "coApplicant";

  const currentForm = caseData?.forms[caseData.currentFormId];
  const selfNeedsToConfirm =
    isCoApplicant &&
    !caseData.hasSymmetricKey &&
    currentForm.encryption.publicKeys[authContext.user.personalNumber] === null;
  const isWaitingForCoApplicantConfirm =
    currentForm.encryption.publicKeys &&
    !caseData.hasSymmetricKey &&
    !Object.entries(currentForm.encryption.publicKeys).every(
      (item) => item[1] !== null
    );

  const shouldShowCTAButton = isCoApplicant
    ? (isWaitingForSign && !selfHasSigned) ||
      (isWaitingForCoApplicantConfirm && selfNeedsToConfirm)
    : isOngoing || isNotStarted || isCompletionRequired || isSigned || isClosed;
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
      cardProps.subtitle = "Väntar";
      cardProps.description = "Din medsökande måste bekräfta...";
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

  if (isCompletionRequired) {
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

  const giveDate = payments?.payment?.givedate
    ? `${
        payments.payment.givedate.split("-")[2]
      } ${getSwedishMonthNameByTimeStamp(payments.payment.givedate, true)}`
    : undefined;

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
  const { cases, getCasesByFormIds, fetchCases } = useContext(
    CaseState
  ) as Required<CaseContextState>;
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

  const activeCases = getCasesByStatuses(["notStarted", "active"]);
  const closedCases = getCasesByStatuses(["closed"]);

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
      // Sometimes new cases is not created in an instant.
      // Due to this we have to give the api some time before we try to fetch cases,
      // since we cannot react to changes as of now.
      const delayBeforeFetch = 4000;
      wait(delayBeforeFetch).then(fetchCases).catch(onFailedToFetchCases);
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
          const formFromCase = caseData.forms[caseData.currentFormId];
          const hasSymmetricKey = await hasGeneratedSymmetricKey(formFromCase);
          const newCase: CaseWithExtra = {
            ...caseData,
            caseType,
            form,
            hasSymmetricKey,
          };
          return newCase;
        });
        return Promise.all(updatedFormCaseObjects);
      });

      await Promise.all(updateCaseItemsPromises).then((updatedItems) => {
        const flattenedList = updatedItems.flat();
        flattenedList.sort((caseA, caseB) => caseB.updatedAt - caseA.updatedAt);
        setCaseItems(flattenedList);
        setIsLoading(false);
      });
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
    const coApplicantItemsToSign = caseItems.filter((caseData) => {
      if (!caseData.persons) return false;

      const person = caseData.persons.find(
        (personEntry) =>
          personEntry.personalNumber === authContext.user.personalNumber
      );
      const isCoApplicant = person?.role === "coApplicant";

      if (!isCoApplicant) return false;

      const currentForm = caseData.forms[caseData.currentFormId];

      const isWaitingForCoApplicantConfirm =
        currentForm.encryption.publicKeys &&
        !caseData.hasSymmetricKey &&
        !Object.entries(currentForm.encryption.publicKeys).every(
          (item) => item[1] !== null
        );

      return isWaitingForCoApplicantConfirm;
    });

    if (coApplicantItemsToSign.length > 0) {
      if (dialogState.hasShownConfirmationThanksModal) return;
      setDialogState({
        ...dialogState,
        showConfirmationThanksModal: true,
        caseData: coApplicantItemsToSign[0],
        hasShownConfirmationThanksModal: true,
      });
    }
  }, [authContext.user?.personalNumber, caseItems, dialogState]);

  const activeCaseCards = activeCases.map((caseData) =>
    computeCaseCardComponent(caseData, navigation, authContext, {
      dialogState,
      setDialogState,
    })
  );

  const closedCaseCards = closedCases.map((caseData) =>
    computeCaseCardComponent(caseData, navigation, authContext, null)
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
              För att starta ansökan måste {coApplicantData?.firstName} bekräfta
              att ni söker tillsammans. {coApplicantData?.firstName} bekräftar
              genom att logga in i appen Mitt Helsingborg.
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
        {activeCases.length === 0 && closedCases.length === 0 ? (
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
        ) : (
          <Card.Button colorSchema="red" disabled>
            <Icon name={refreshing ? "refresh" : "arrow-downward"} />
            <Text>Dra för att ladda om sidan</Text>
          </Card.Button>
        )}
        <ListHeading type="h5">Aktiva</ListHeading>
        {activeCases.length > 0 && (
          <Animated.View style={{ opacity: fadeAnimation }}>
            {activeCaseCards}
          </Animated.View>
        )}

        {!isLoading && activeCases.length === 0 && (
          <Animated.View style={{ opacity: fadeAnimation }}>
            <Card>
              <CardMessageBody>
                <Card.Text>Du har inga aktiva ärenden.</Card.Text>
              </CardMessageBody>
            </Card>
          </Animated.View>
        )}

        {closedCases.length > 0 && (
          <Animated.View style={{ opacity: fadeAnimation }}>
            <ListHeading type="h5">Avslutade</ListHeading>
            {closedCaseCards}
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
