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
import icons from "../../helpers/Icons";
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
import {
  State as CaseContextState,
  Dispatch as CaseContextDispatch,
  AddCoApplicantParameters,
} from "../../types/CaseContext";
import { to, wait } from "../../helpers/Misc";
import { Case, ApplicationStatusType, AnsweredForm } from "../../types/Case";
import { Form } from "../../types/FormTypes";
import {
  answersAreEncrypted,
  getPasswordForForm,
} from "../../services/encryption/CaseEncryptionHelper";
import PinInputModal from "../../components/organisms/PinInputModal/PinInputModal";
import NewApplicationModal from "../../components/organisms/NewApplicationModal/NewApplicationModal";
import AddCoApplicantModal from "../../components/organisms/AddCoApplicantModal/AddCoApplicantModal";

import statusTypeConstantMapper from "./statusTypeConstantMapper";

const { NEW_APPLICATION, NOT_STARTED, CLOSED, ACTIVE } = ApplicationStatusType;

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

/**
 * Returns a case card component depending on it's status
 * @param {obj} caseData
 * @param {obj} navigation
 * @param {obj} authContext
 * @param {function?} extra.dialogState
 */
const computeCaseCardComponent = (
  caseData,
  navigation,
  authContext,
  onShowPinInput
) => {
  const currentStep =
    caseData?.forms?.[caseData.currentFormId]?.currentPosition
      ?.currentMainStep || 0;
  const totalSteps = caseData.form?.stepStructure
    ? caseData.form.stepStructure.length
    : 0;

  const persons = caseData?.persons ?? [];

  const details = caseData?.details ?? {};
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
    (person) => person.personalNumber === authContext?.user?.personalNumber
  );

  const statusType = caseData?.status?.type || "";
  const {
    isNotStarted,
    isOngoing,
    isRandomCheckRequired,
    isVivaCompletionRequired,
    isSigned,
    isClosed,
    isWaitingForSign,
    isActiveSubmittedRandomCheck,
    shouldShowAppealButton,
    activeSubmittedCompletion,
  } = statusTypeConstantMapper(statusType);

  const selfHasSigned = casePersonData?.hasSigned;
  const isCoApplicant = casePersonData?.role === "coApplicant";

  const currentForm: AnsweredForm = caseData?.forms[caseData.currentFormId];

  const isEncrypted = answersAreEncrypted(currentForm.answers);
  const shouldEnterPin = isEncrypted && isCoApplicant && isWaitingForSign;

  const shouldShowCTAButton =
    (!isEncrypted || shouldEnterPin) &&
    (isCoApplicant
      ? isWaitingForSign && !selfHasSigned
      : isOngoing ||
        isNotStarted ||
        isRandomCheckRequired ||
        isSigned ||
        isClosed ||
        isVivaCompletionRequired ||
        isActiveSubmittedRandomCheck ||
        activeSubmittedCompletion);

  const buttonProps: InternalButtonProps = {
    onClick: () => navigation.onOpenForm(caseData),
    text: "",
    colorSchema: null,
  };

  const cardProps: InternalCardProps = {
    subtitle: caseData.status.name,
    onClick: () => navigation.onOpenCaseSummary(caseData),
  };

  if (isClosed) {
    buttonProps.text = "Öppna";

    buttonProps.onClick = () => {
      navigation.onOpenCaseSummary(caseData);
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

  if (isSigned) {
    buttonProps.text = "Ladda upp filer och dokument";
  }

  if (isWaitingForSign && !selfHasSigned) {
    buttonProps.onClick = () =>
      navigation.navigate("Form", { caseId: caseData.id, isSignMode: true });
    buttonProps.text = "Granska och signera";
  }

  if (isVivaCompletionRequired || activeSubmittedCompletion) {
    buttonProps.text = "Komplettera ansökan";
  }

  if (isActiveSubmittedRandomCheck || activeSubmittedCompletion) {
    buttonProps.text = "Skicka in fler bilder";
    cardProps.description = caseData.status.description;
  }

  const giveDate = payments?.payment?.givedate
    ? `${
        payments.payment.givedate.split("-")[2]
      } ${getSwedishMonthNameByTimeStamp(payments.payment.givedate, true)}`
    : undefined;

  if (shouldEnterPin) {
    buttonProps.onClick = onShowPinInput;
    buttonProps.text = "Ange pinkod";
    cardProps.onClick = undefined;
  }

  const shouldShowPin = isWaitingForSign && !isCoApplicant;

  if (shouldShowPin) {
    const partner = persons.find((person) => person.role === "coApplicant");
    const partnerName = partner?.firstName;
    cardProps.description = `${partnerName} loggar in i appen med BankID och anger koden för att granska och signera er ansökan.\n\nKod till ${partnerName}:`;
  }

  const pinToShow = shouldShowPin ? caseData.password : null;

  const openAppealLink = async () => {
    const url =
      "https://helsingborg.se/omsorg-och-stod/socialt-och-ekonomiskt-stod/ekonomiskt-bistand/overklaga/";
    const supported = await Linking.canOpenURL(url);

    if (!supported) return;

    await Linking.openURL(url);
  };

  return (
    <CaseCard
      key={caseData.id}
      colorSchema={colorSchema}
      title={caseData.caseType.name}
      subtitle={cardProps.subtitle}
      largeSubtitle={applicationPeriodMonth}
      description={cardProps.description ?? caseData.status.description}
      icon={icons[caseData.caseType.icon]}
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
      pin={pinToShow}
    />
  );
};

interface CaseWithExtra extends Case {
  caseType: typeof caseTypes[0];
  form?: Form;
  password?: string;
}

interface CaseOverviewProps {
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
}

/**
 * Case overview screen
 * @param {obj} props
 */
function CaseOverview(props: CaseOverviewProps): JSX.Element {
  const { navigation } = props;
  const [caseItems, setCaseItems] = useState<CaseWithExtra[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>({});

  const { getCasesByFormIds, fetchCases } = useContext(
    CaseState
  ) as Required<CaseContextState>;
  const { providePinForCase, addCoApplicant } =
    useContext<CaseContextDispatch>(CaseDispatch);
  const { getForm, getFormIdsByFormTypes } = useContext(FormContext);
  const fadeAnimation = useRef(new Animated.Value(0)).current;

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
          const newCaseData: CaseWithExtra = {
            ...caseData,
            caseType,
            form: form ?? undefined,
            password: password ?? undefined,
          };
          return newCaseData;
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
  }, [authContext.user, getCasesByFormIds, getForm, getFormIdsByFormTypes]);

  const openForm = (caseItem: CaseWithExtra, isSignMode?: boolean) => {
    navigation.navigate("Form", { caseId: caseItem.id, isSignMode });
  };

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
          modalName: mainPerson.firstName,
        },
      });
    }
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
    caseItem: CaseWithExtra,
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
      openForm(caseItem);
    }
  };

  const onEnteredPinForCase = async (pin: string) => {
    if (activeModal?.data?.case) {
      const [provideError] = await to(
        providePinForCase(activeModal?.data?.case as Case, pin)
      );
      if (provideError) {
        console.warn("provide pin error:", provideError);
        setModalError("Något blev fel");
      } else {
        closeOpenModal();
        onRefresh();
      }
    }
  };

  const openCaseSummary = (caseItem: CaseWithExtra) => {
    navigation.navigate("UserEvents", {
      screen: caseItem.caseType.navigateTo,
      params: {
        id: caseItem.id,
        name: caseItem.caseType.name,
      },
    });
  };

  const activeCaseCards = activeCases.map((caseData) =>
    computeCaseCardComponent(
      caseData,
      { onOpenForm: openForm, onOpenCaseSummary: openCaseSummary },
      authContext,
      () => openPinInputModal(caseData)
    )
  );

  const closedCaseCards = closedCases.map((caseData) =>
    computeCaseCardComponent(
      caseData,
      { onOpenForm: openForm, onOpenCaseSummary: openCaseSummary },
      authContext,
      () => openPinInputModal(caseData)
    )
  );

  return (
    <ScreenWrapper {...props}>
      <Header title="Mina ärenden" />

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
          name={(activeModal?.data?.modalName as string) ?? ""}
          visible
          onClose={closeOpenModal}
          onPinEntered={onEnteredPinForCase}
          error={activeModal?.error}
        />
      )}

      {activeModal.modal === Modal.START_NEW_APPLICATION && (
        <NewApplicationModal
          visible
          onClose={closeOpenModal}
          onOpenForm={() => openForm(newCase)}
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
