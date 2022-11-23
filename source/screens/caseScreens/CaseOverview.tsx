import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Animated, Easing, Linking, RefreshControl } from "react-native";
import styled from "styled-components/native";
import { useFocusEffect } from "@react-navigation/native";

import FloatingButton from "../../components/molecules/FloatingButton";
import { Text, Icon } from "../../components/atoms";
import {
  Card,
  CaseCard,
  Header,
  ScreenWrapper,
  CloseDialog,
} from "../../components/molecules";
import { getSwedishMonthNameByTimeStamp } from "../../helpers/DateHelpers";
import { CaseState, CaseDispatch } from "../../store/CaseContext";
import { convertDataToArray, calculateSum } from "../../helpers/FormatVivaData";
import AuthContext from "../../store/AuthContext";
import type {
  State as CaseContextState,
  Dispatch as CaseContextDispatch,
  AddCoApplicantParameters,
} from "../../types/CaseContext";
import { to, wait } from "../../helpers/Misc";
import type { Case, AnsweredForm, Answer } from "../../types/Case";
import { ApplicationStatusType } from "../../types/Case";
import { answersAreEncrypted } from "../../services/encryption/CaseEncryptionHelper";
import PinInputModal from "../../components/organisms/PinInputModal/PinInputModal";
import NewApplicationModal from "../../components/organisms/NewApplicationModal/NewApplicationModal";
import AddCoApplicantModal from "../../components/organisms/AddCoApplicantModal/AddCoApplicantModal";
import PdfModal from "../../components/organisms/PdfModal/PdfModal";

import statusTypeConstantMapper from "./statusTypeConstantMapper";
import useGetFormPasswords from "./useGetFormPasswords";
import useSetupForm from "../../containers/Form/hooks/useSetupForm";
import { isPdfAvailable, pdfToBase64String } from "./pdf.helper";

import ICON from "../../assets/images/icons";

const { NEW_APPLICATION, NOT_STARTED, CLOSED, ACTIVE, APPROVED } =
  ApplicationStatusType;

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

const colorSchema = "red";

const StyledIcon = styled(Icon)`
  color: ${(props) => props.theme.colors.primary[colorSchema][0]};
`;

const PaddedContainer = styled.View`
  padding-top: 16px;
`;

enum Modal {
  PIN_INPUT,
  START_NEW_APPLICATION,
  ADD_CO_APPLICANT,
  SETUP_LOADING_FORM_MODAL,
}

interface ActiveModal {
  modal?: Modal;
  error?: string;
  loading?: boolean;
  data?: Record<string, unknown>;
}

interface InternalCardProps {
  subtitle: string;
  description?: string;
  onClick?: () => void;
}

interface InternalButtonProps {
  text: string;
  colorSchema: string | null;
  onClick: () => void;
}

interface CaseCardNavigation {
  onOpenForm: (caseId: string, isSignMode?: boolean) => void;
  onOpenCaseSummary: (caseId: string) => void;
}

const computeCaseCardComponent = (
  {
    caseItem,
    formPassword,
  }: { caseItem: Case; formPassword: string | undefined },
  navigation: CaseCardNavigation,
  signedInPersonalNumber: string,
  onShowPinInput: () => void,
  onOpenPdf: () => void
) => {
  const currentForm: AnsweredForm = caseItem?.forms[caseItem.currentFormId];

  const currentStep = currentForm.currentPosition?.currentMainStep ?? 0;
  const totalSteps = currentForm.currentPosition?.numberOfMainSteps ?? 0;

  const persons = caseItem?.persons ?? [];
  const caseId = caseItem.id;

  const details = caseItem?.details ?? {};
  const { workflow = {}, period = {} } = details;
  const { decision = {}, payments = {} } = workflow;

  const applicationPeriodMonth = period?.endDate
    ? getSwedishMonthNameByTimeStamp(period?.endDate, true)
    : "";

  const decisions = decision?.decisions?.decision
    ? convertDataToArray(decision.decisions.decision)
    : [];

  const paymentsArray = decisions.filter(
    (caseDecision) => caseDecision?.typecode === "01"
  );
  const partiallyApprovedDecisionsAndRejected = decisions.filter(
    (caseDecision) => ["03", "02"].includes(caseDecision.typecode)
  );

  const casePersonData = persons.find(
    (person) => person.personalNumber === signedInPersonalNumber
  );

  const statusType = caseItem?.status?.type || "";
  const {
    isNotStarted,
    isOngoing,
    isRandomCheckRequired,
    isVivaCompletionRequired,
    isClosed,
    isWaitingForSign,
    isActiveSubmittedRandomCheck,
    shouldShowAppealButton,
    activeSubmittedCompletion,
  } = statusTypeConstantMapper(statusType);

  const canShowPdf =
    !statusType.toLowerCase().includes(APPROVED) &&
    isPdfAvailable(caseItem.pdf);
  const selfHasSigned = casePersonData?.hasSigned;
  const isCoApplicant = casePersonData?.role === "coApplicant";

  const shouldEnterPin = answersAreEncrypted(currentForm.answers);

  const shouldShowCTAButton = isCoApplicant
    ? isWaitingForSign && !selfHasSigned
    : isOngoing ||
      isNotStarted ||
      isRandomCheckRequired ||
      isClosed ||
      isVivaCompletionRequired ||
      isActiveSubmittedRandomCheck ||
      activeSubmittedCompletion;

  const buttonProps: InternalButtonProps = {
    onClick: () => navigation.onOpenForm(caseId),
    text: "",
    colorSchema: null,
  };

  const cardProps: InternalCardProps = {
    subtitle: caseItem.status.name,
    onClick: () => navigation.onOpenCaseSummary(caseId),
  };

  if (isClosed) {
    buttonProps.text = "Öppna";

    buttonProps.onClick = () => {
      navigation.onOpenCaseSummary(caseId);
    };
  }

  if (isOngoing) {
    buttonProps.text = "Fortsätt";
  }

  if (isNotStarted) {
    buttonProps.text = "Starta ansökan";
  }

  if (isRandomCheckRequired) {
    buttonProps.text = "Starta stickprov";
  }

  if (isWaitingForSign && !selfHasSigned) {
    buttonProps.onClick = () => navigation.onOpenForm(caseId, true);
    buttonProps.text = "Granska och signera";
  }

  if (isVivaCompletionRequired || activeSubmittedCompletion) {
    buttonProps.text = "Komplettera ansökan";
  }

  if (isActiveSubmittedRandomCheck || activeSubmittedCompletion) {
    buttonProps.text = "Skicka in fler bilder";
    cardProps.description = caseItem.status.description;
  }

  const giveDate = payments?.payment?.givedate
    ? `${
        payments.payment.givedate.split("-")[2]
      } ${getSwedishMonthNameByTimeStamp(payments.payment.givedate, true)}`
    : undefined;

  if (shouldEnterPin) {
    buttonProps.onClick = onShowPinInput;
    buttonProps.text = "Ange pinkod";
    cardProps.onClick = () => navigation.onOpenCaseSummary(caseId);
  }

  const shouldShowPin = isWaitingForSign && !isCoApplicant;

  if (shouldShowPin) {
    const partner = persons.find((person) => person.role === "coApplicant");
    const partnerName = partner?.firstName;
    cardProps.description = `${caseItem.status.description}\n\n${partnerName} loggar in i appen med BankID och anger koden för att granska och signera er ansökan.\n\nKod till ${partnerName}:`;
  }

  const openAppealLink = async () => {
    const url =
      "https://helsingborg.se/omsorg-och-stod/socialt-och-ekonomiskt-stod/ekonomiskt-bistand/overklaga/";
    const supported = await Linking.canOpenURL(url);

    if (!supported) return;

    await Linking.openURL(url);
  };

  return (
    <CaseCard
      key={caseId}
      colorSchema={colorSchema}
      title="Ekonomiskt bistånd"
      subtitle={cardProps.subtitle}
      largeSubtitle={applicationPeriodMonth}
      description={cardProps.description ?? caseItem.status.description}
      icon={ICON.ICON_EKB}
      showButton={shouldShowCTAButton}
      showAppealButton={shouldShowAppealButton}
      buttonText={buttonProps.text}
      currentStep={currentStep}
      totalSteps={totalSteps}
      showPayments={isClosed}
      showProgress={isOngoing}
      approvedAmount={calculateSum(paymentsArray)}
      declinedAmount={calculateSum(partiallyApprovedDecisionsAndRejected)}
      givedate={giveDate}
      onCardClick={cardProps.onClick}
      onAppealButtonClick={openAppealLink}
      onButtonClick={buttonProps.onClick}
      buttonColorScheme={buttonProps.colorSchema || colorSchema}
      pin={shouldShowPin ? formPassword : undefined}
      showDownloadPdfButton={canShowPdf}
      onOpenPdf={onOpenPdf}
    />
  );
};

interface CaseOverviewProps {
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
}

function CaseOverview(props: CaseOverviewProps): JSX.Element {
  const { navigation } = props;
  const [refreshing, setRefreshing] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>({});
  const [showPdfForCase, setShowPdfForCase] = useState<string>("");

  const { fetchCases, cases } = useContext(
    CaseState
  ) as Required<CaseContextState>;
  const { providePinForCase, addCoApplicant } =
    useContext<CaseContextDispatch>(CaseDispatch);
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const { user } = useContext(AuthContext);

  const passwords = useGetFormPasswords(cases, user);
  const [setupForm] = useSetupForm();

  const getCasesByStatuses = (statuses: string[]): Case[] =>
    Object.values(cases).filter((caseData) => {
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
      if (user) {
        // Sometimes new cases is not created in an instant.
        // Due to this we have to give the api some time before we try to fetch cases,
        // since we cannot react to changes as of now.
        const delayBeforeFetch = 4000;
        wait(delayBeforeFetch).then(fetchCases).catch(onFailedToFetchCases);
      }
    }, [user, fetchCases])
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
    const fetchAllCases = async () => {
      await fetchCases();
    };

    void fetchAllCases();
  }, [fetchCases]);

  const openModal = (
    modal: Modal,
    modalConfig: Record<string, unknown> = {}
  ) => {
    setActiveModal({ modal, ...modalConfig });
  };

  const closeOpenModal = () => setActiveModal({});

  const openNewApplicationModal = () => openModal(Modal.START_NEW_APPLICATION);

  const openAddCoApplicantModal = () => openModal(Modal.ADD_CO_APPLICANT);

  const openPinInputModal = (caseData: Case) => {
    const mainPerson = caseData.persons?.find(
      (person) => person.role === "applicant"
    );

    if (mainPerson?.firstName) {
      openModal(Modal.PIN_INPUT, {
        data: {
          partnerName: mainPerson.firstName,
          case: caseData,
        },
      });
    }
  };

  const openForm = async (caseId: string, isSignMode?: boolean) => {
    openModal(Modal.SETUP_LOADING_FORM_MODAL);

    await setupForm(
      cases[caseId].forms[cases[caseId].currentFormId].answers as Answer[],
      cases[caseId].currentFormId
    );

    closeOpenModal();

    navigation.navigate("Form", { caseId, isSignMode });
  };

  const setModalError = (errorMessage: string) => {
    setActiveModal((oldValue) => ({
      ...oldValue,
      error: errorMessage,
      loading: false,
    }));
  };

  const setModalLoading = (loading: boolean) => {
    setActiveModal((oldValue) => ({
      ...oldValue,
      loading,
      error: "",
    }));
  };

  const handleAddCoApplicant = async (
    caseItem: Case,
    parameters: AddCoApplicantParameters
  ) => {
    setModalLoading(true);

    const [addCoApplicantError] = await to(
      addCoApplicant(caseItem.id, parameters)
    );
    setModalLoading(false);

    if (addCoApplicantError) {
      setModalError(addCoApplicantError.message);
    } else {
      await openForm(caseItem.id);
    }
  };

  const onEnteredPinForCase = async (pin: string) => {
    if (activeModal?.data?.case) {
      const [provideError] = await to(
        providePinForCase(activeModal?.data?.case as Case, pin)
      );
      if (provideError) {
        console.warn("provide pin error:", provideError);
        setModalError("Fel kod - försök igen");
      } else {
        closeOpenModal();
        onRefresh();
      }
    }
  };

  const openCaseSummary = (caseId: string) => {
    navigation.navigate("UserEvents", {
      screen: "CaseSummary",
      params: {
        id: caseId,
        name: "Ekonomiskt bistånd",
      },
    });
  };

  const activeCaseCards = activeCases.map((caseData) =>
    computeCaseCardComponent(
      {
        caseItem: caseData,
        formPassword: passwords[caseData.id] ?? undefined,
      },
      { onOpenForm: openForm, onOpenCaseSummary: openCaseSummary },
      user?.personalNumber,
      () => openPinInputModal(caseData),
      () => setShowPdfForCase(caseData.id)
    )
  );

  const closedCaseCards = closedCases.map((caseData) =>
    computeCaseCardComponent(
      {
        caseItem: caseData,
        formPassword: passwords[caseData.id] ?? undefined,
      },
      { onOpenForm: openForm, onOpenCaseSummary: openCaseSummary },
      user?.personalNumber,
      () => openPinInputModal(caseData),
      () => setShowPdfForCase(caseData.id)
    )
  );

  const hidePdfModal = () => {
    setShowPdfForCase("");
  };

  return (
    <ScreenWrapper {...props}>
      <Header title="Mina ärenden" />

      <Container
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {(showActiveCases || showClosedCases) && (
          <Card.Button colorSchema="red" disabled onClick={() => undefined}>
            <Icon name={refreshing ? "refresh" : "arrow-downward"} />
            <Text>Dra för att ladda om sidan</Text>
          </Card.Button>
        )}

        {activeCases.length === 0 && closedCases.length === 0 && (
          <>
            <PaddedContainer>
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
            </PaddedContainer>

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

      {activeModal.modal === Modal.PIN_INPUT && (
        <PinInputModal
          name={(activeModal?.data?.partnerName as string) ?? ""}
          visible
          onClose={closeOpenModal}
          onPinEntered={onEnteredPinForCase}
          error={activeModal?.error}
        />
      )}

      <PdfModal
        isVisible={!!showPdfForCase}
        toggleModal={hidePdfModal}
        uri={pdfToBase64String(cases[showPdfForCase]?.pdf)}
      />

      {activeModal.modal === Modal.START_NEW_APPLICATION && (
        <NewApplicationModal
          visible
          onClose={closeOpenModal}
          onOpenForm={() => openForm(newCase.id)}
          onChangeModal={openAddCoApplicantModal}
        />
      )}

      {activeModal.modal === Modal.ADD_CO_APPLICANT && (
        <AddCoApplicantModal
          visible
          onClose={closeOpenModal}
          onAddCoApplicant={(parameters) =>
            handleAddCoApplicant(newCase, parameters)
          }
          isLoading={activeModal.loading}
          errorMessage={activeModal.error}
        />
      )}

      {activeModal.modal === Modal.SETUP_LOADING_FORM_MODAL && (
        <CloseDialog
          visible
          title="Förbereder formulär"
          body="Vänligen vänta ..."
        />
      )}

      {newCase && (
        <FloatingButton
          onPress={openNewApplicationModal}
          text="Ansök om ekonomiskt bistånd"
          iconName="account-balance-wallet"
          position="center"
          buttonWidth="90%"
        />
      )}
    </ScreenWrapper>
  );
}

export default CaseOverview;
