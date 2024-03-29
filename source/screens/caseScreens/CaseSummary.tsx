import { View, Animated, Easing } from "react-native";
import React, {
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  CaseCalculationsModal,
  RemoveCaseModal,
  PdfModal,
  SetupFormModal,
} from "../../components/organisms";

import { ScreenWrapper, CaseCard } from "../../components/molecules";
import ContactCard from "../../components/molecules/ContactCard";
import { useModal } from "../../components/molecules/Modal";

import { Text, Button } from "../../components/atoms";

import { CaseState, CaseDispatch } from "../../store/CaseContext";
import AuthContext from "../../store/AuthContext";

import getUnapprovedCompletionDescriptions from "../../helpers/FormatCompletions";
import { convertDataToArray, calculateSum } from "../../helpers/FormatVivaData";
import { getSwedishMonthNameByTimeStamp } from "../../helpers/DateHelpers";
import { put, remove } from "../../helpers/ApiRequest";
import { canCaseBeRemoved } from "../../helpers/Case";

import useSetupForm from "../../containers/Form/hooks/useSetupForm";
import statusTypeConstantMapper from "./statusTypeConstantMapper";
import { isPdfAvailable, pdfToBase64String } from "./pdf.helper";
import { answersAreEncrypted } from "../../services/encryption";
import useGetFormPasswords from "./useGetFormPasswords";

import { ApplicationStatusType } from "../../types/Case";

import {
  Container,
  SummaryHeading,
  RemoveCaseButtonContainer,
} from "./CaseSummary.styled";

import type { PrimaryColor } from "../../theme/themeHelpers";
import type { Props } from "./CaseSummary.types";
import type {
  Case,
  VIVACaseDetails,
  Workflow,
  Journal,
  Decision,
  Calculations,
  Answer,
  PDF,
  AnsweredForm,
} from "../../types/Case";

const { APPROVED } = ApplicationStatusType;
const SCREEN_TRANSITION_DELAY = 1000;

const computeCaseCardComponent = (
  caseItem: Case,
  formName: string,
  colorSchema: PrimaryColor,
  navigation: { onOpenForm: (caseId: string, isSignMode?: boolean) => void },
  toggleModal: () => void,
  personalNumber: string,
  formPassword: string | undefined,
  onOpenPdf: () => void,
  onHandleRemoveCase: () => void
) => {
  const {
    currentPosition: { currentMainStep: currentStep, numberOfMainSteps },
  } = caseItem.forms[caseItem.currentFormId];

  const caseId = caseItem.id;
  const status = caseItem?.status;
  const persons = caseItem.persons ?? [];
  const details = caseItem?.details ?? {};
  const { workflow = {}, period = {} } = details;
  const { decision = {}, payments = {} } = workflow;
  const statusType = status?.type ?? "";

  const requestedCompletions = caseItem.details.completions?.requested || [];

  const isRandomCheck = statusType.includes("randomCheck");
  const completionsClarification =
    (!isRandomCheck && caseItem.details.completions?.description) || "";

  const applicationPeriodMonth = period?.endDate
    ? getSwedishMonthNameByTimeStamp(period?.endDate, true)
    : "";

  const canShowPdf =
    !statusType.toLowerCase().includes(APPROVED) &&
    isPdfAvailable(caseItem?.pdf);
  const casePersonData = persons.find(
    (person) => person.personalNumber === personalNumber
  );

  const {
    isNotStarted,
    isOngoing,
    isRandomCheckRequired,
    isVivaCompletionRequired,
    isClosed,
    isWaitingForSign,
    isActiveSubmittedRandomCheck,
    activeSubmittedCompletion,
  } = statusTypeConstantMapper(statusType);

  const selfHasSigned = casePersonData?.hasSigned;
  const isCoApplicant = casePersonData?.role === "coApplicant";

  const decisions = decision?.decisions?.decision
    ? convertDataToArray(decision.decisions.decision)
    : [];

  const paymentsArray = decisions.filter(
    (caseDecision) => caseDecision.typecode === "01"
  );
  const partiallyApprovedDecisionsAndRejected = decisions.filter(
    (caseDecision) => ["03", "02"].includes(caseDecision.typecode)
  );

  const buttonProps = {
    onClick: () => navigation.onOpenForm(caseId),
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

  if (isVivaCompletionRequired || activeSubmittedCompletion) {
    buttonProps.text = "Komplettera ansökan";
  }

  if (isClosed) {
    buttonProps.text = "Visa beslut";
  }

  if (isWaitingForSign && !selfHasSigned) {
    buttonProps.onClick = () => navigation.onOpenForm(caseId, true);
    buttonProps.text = "Granska och signera";
  }

  if (isActiveSubmittedRandomCheck || activeSubmittedCompletion) {
    buttonProps.text = "Skicka in fler bilder";
  }

  const giveDate = payments?.payment?.givedate
    ? `${
        payments.payment.givedate.split("-")[2]
      } ${getSwedishMonthNameByTimeStamp(payments.payment.givedate, true)}`
    : undefined;

  const isStatusCompletion = [
    "completion",
    "active:randomCheck",
    "ongoing:randomCheck",
    "submitted:randomCheck",
  ].some((type) => statusType.includes(type));

  const unApprovedCompletionDescriptions = isStatusCompletion
    ? getUnapprovedCompletionDescriptions(requestedCompletions)
    : [];

  const shouldShowPin = isWaitingForSign && !isCoApplicant;

  let description = status.detailedDescription || status.description;
  if (shouldShowPin) {
    const partner = persons.find((person) => person.role === "coApplicant");
    const partnerName = partner?.firstName;
    description = `${caseItem.status.description}\n\n${partnerName} loggar in i appen med BankID och anger koden för att granska och signera er ansökan.\n\nKod till ${partnerName}:`;
  }

  let subtitle = status.name;

  const currentForm: AnsweredForm = caseItem.forms[caseItem.currentFormId];
  const shouldEnterPin = answersAreEncrypted(currentForm.answers);
  const canRemoveCase = canCaseBeRemoved(caseItem) && !isCoApplicant;
  const isEncryptionBroken = canRemoveCase && shouldEnterPin;

  if (isEncryptionBroken) {
    subtitle = "Något har gått fel";
    description =
      "Fel med en ansökan kan uppstå om du har installerat om appen eller bytt telefon. Tyvärr behöver du göra om ansökan för månaden.";
    buttonProps.text = "Gör om ansökan";
    buttonProps.onClick = onHandleRemoveCase;
  }

  const shouldShowCTAButton = isCoApplicant
    ? (isWaitingForSign && !selfHasSigned) || isClosed
    : isOngoing ||
      isNotStarted ||
      isRandomCheckRequired ||
      isClosed ||
      isVivaCompletionRequired ||
      isActiveSubmittedRandomCheck ||
      activeSubmittedCompletion ||
      (isEncryptionBroken && !isCoApplicant);

  return (
    <CaseCard
      colorSchema={colorSchema}
      title={applicationPeriodMonth || formName}
      subtitle={subtitle}
      showProgress={isOngoing && !isEncryptionBroken}
      currentStep={currentStep}
      totalSteps={numberOfMainSteps}
      description={description || ""}
      showPayments={isClosed && !!payments?.payment?.givedate}
      approvedAmount={calculateSum(paymentsArray, "kronor")}
      givedate={giveDate}
      declinedAmount={calculateSum(
        partiallyApprovedDecisionsAndRejected,
        "kronor"
      )}
      showButton={shouldShowCTAButton}
      buttonText={buttonProps.text}
      onButtonClick={isClosed ? toggleModal : buttonProps.onClick}
      buttonIconName={isClosed ? "remove-red-eye" : "arrow-forward"}
      completions={unApprovedCompletionDescriptions}
      completionsClarification={completionsClarification}
      pin={shouldShowPin ? formPassword : undefined}
      showDownloadPdfButton={canShowPdf}
      onOpenPdf={onOpenPdf}
      vivaCaseId={details.vivaCaseId}
    />
  );
};

const CaseSummary = (props: Props): JSX.Element => {
  const authContext = useContext(AuthContext);
  const { cases, getCase } = useContext(CaseState);
  const { deleteCase } = useContext(CaseDispatch);

  const [openPdf, setOpenPdf] = useState(false);

  const {
    colorSchema = "red",
    navigation,
    route: {
      params: { id: caseId, name: formName },
    },
  } = props;

  const caseData: Case = useMemo(() => cases[caseId] ?? {}, [cases, caseId]);
  const person = caseData.persons.find(
    ({ personalNumber }) => personalNumber === authContext.user?.personalNumber
  );
  const isApplicant = person?.role === "applicant";

  const details = caseData?.details ?? ({} as VIVACaseDetails);
  const contacts = caseData?.contacts ?? [];
  const { workflow = {} } = details;
  const {
    decision = {} as Decision,
    calculations = {} as Calculations,
    journals = {} as Journal,
  } = workflow as Workflow;

  const [isModalVisible, toggleModal] = useModal();
  const [showRemoveCaseModal, toggleRemoveCaseModal] = useModal();

  const [showSetupFormModal, setShowSetupFormModal] = useState(false);
  const [hasSetupFormError, setSetupFormError] = useState(false);

  const [setupForm] = useSetupForm();
  const passwords = useGetFormPasswords(cases, authContext.user);

  const decisions = decision?.decisions?.decision
    ? convertDataToArray(decision.decisions.decision)
    : [];

  const canRemoveCase = canCaseBeRemoved(caseData) && isApplicant;
  const currentForm: AnsweredForm = caseData.forms[caseData.currentFormId];
  const shouldEnterPin = answersAreEncrypted(currentForm.answers);
  const isEncryptionBroken = canRemoveCase && shouldEnterPin;

  const removeCase = async () => {
    const result = await remove(`cases/${caseId}`, undefined, undefined);

    if (!result.data.data.code) {
      deleteCase(caseId);

      setTimeout(() => {
        toggleRemoveCaseModal();
        navigation.reset({
          index: 0,
          routes: [{ name: "App" }],
        });
      }, SCREEN_TRANSITION_DELAY);
    } else {
      throw new Error("Could not delete case");
    }
  };

  const updateCaseSignature = useCallback(
    async (caseItem, signatureSuccessful) => {
      const caseForm = caseItem.forms[caseItem.currentFormId];

      const updateCaseRequestBody = {
        currentFormId: caseItem.currentFormId,
        ...caseForm,
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

  const closeSetupFormModal = () => {
    setShowSetupFormModal(false);
  };

  const openForm = async (id: string, isSignMode = false) => {
    setSetupFormError(false);
    setShowSetupFormModal(true);

    try {
      await setupForm(
        cases[id].forms[cases[id].currentFormId].answers as Answer[],
        cases[id].currentFormId
      );

      closeSetupFormModal();
      navigation.navigate("Form", { caseId: id, isSignMode });
    } catch (error) {
      setSetupFormError(true);
    }
  };

  const onRetryOpenForm = async () => {
    await openForm(caseId);
  };

  useEffect(() => {
    const updateCaseAfterSignature = async () => {
      if (authContext.status === "signResolved") {
        const userCase = getCase(caseId);
        await updateCaseSignature(userCase, true);
      }
    };

    void updateCaseAfterSignature();
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

  const handleRemoveCaseButtonClick = () => {
    toggleRemoveCaseModal();
  };

  const togglePdf = () => {
    setOpenPdf((oldValue) => !oldValue);
  };

  return (
    <ScreenWrapper>
      <Container as={Animated.ScrollView} style={{ opacity: fadeAnimation }}>
        <SummaryHeading type="h5">Aktuell period</SummaryHeading>
        {Object.keys(caseData).length > 0 &&
          computeCaseCardComponent(
            caseData,
            formName,
            colorSchema,
            { onOpenForm: openForm },
            toggleModal,
            authContext.user.personalNumber,
            passwords[caseData.id] ?? undefined,
            togglePdf,
            handleRemoveCaseButtonClick
          )}

        {contacts.length > 0 && (
          <View>
            <SummaryHeading type="h5">Kontakt</SummaryHeading>
            {contacts.map(({ name, description }) => (
              <ContactCard key={name} name={name} description={description} />
            ))}
          </View>
        )}
      </Container>

      <CaseCalculationsModal
        isVisible={isModalVisible}
        toggleModal={toggleModal}
        calculation={calculations?.calculation}
        decisions={decisions}
        notes={journals?.journal?.notes?.note ?? []}
      />

      <RemoveCaseModal
        visible={showRemoveCaseModal}
        onCloseModal={toggleRemoveCaseModal}
        onRemoveCase={removeCase}
      />

      {showSetupFormModal && (
        <SetupFormModal
          visible
          onCloseModal={closeSetupFormModal}
          onRetryOpenForm={onRetryOpenForm}
          hasError={hasSetupFormError}
        />
      )}

      <PdfModal
        isVisible={openPdf}
        toggleModal={togglePdf}
        uri={pdfToBase64String(caseData.pdf as PDF)}
      />

      <RemoveCaseButtonContainer>
        {canRemoveCase && !isEncryptionBroken && (
          <Button
            onClick={handleRemoveCaseButtonClick}
            colorSchema="red"
            fullWidth
          >
            <Text>Ta bort ansökan</Text>
          </Button>
        )}
      </RemoveCaseButtonContainer>
    </ScreenWrapper>
  );
};

export default CaseSummary;
