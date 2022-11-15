import React, {
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import { View, Animated, Easing } from "react-native";

import {
  CaseCalculationsModal,
  RemoveCaseModal,
  TransparentBottomModal,
  PdfModal,
} from "../../components/organisms";

import { Card, ScreenWrapper, CaseCard } from "../../components/molecules";
import { useModal } from "../../components/molecules/Modal";

import { Icon, Text, MoreButton } from "../../components/atoms";

import { CaseState, CaseDispatch } from "../../store/CaseContext";
import AuthContext from "../../store/AuthContext";

import getUnapprovedCompletionDescriptions from "../../helpers/FormatCompletions";
import { convertDataToArray, calculateSum } from "../../helpers/FormatVivaData";
import { launchPhone, launchEmail } from "../../helpers/LaunchExternalApp";
import { getSwedishMonthNameByTimeStamp } from "../../helpers/DateHelpers";
import { put, remove } from "../../helpers/ApiRequest";
import icons from "../../helpers/Icons";

import type { PrimaryColor } from "../../theme/themeHelpers";
import { ApplicationStatusType } from "../../types/Case";

import type {
  Case,
  VIVACaseDetails,
  Workflow,
  Journal,
  Decision,
  Calculations,
} from "../../types/Case";
import type { TransparentModalButton } from "../../components/organisms/TransparentBottomModal/TransparentBottomModal.types";

import statusTypeConstantMapper from "./statusTypeConstantMapper";
import useGetFormPasswords from "./useGetFormPasswords";

import type { Props } from "./CaseSummary.types";

import { Container, SummaryHeading } from "./CaseSummary.styled";

const { ACTIVE_SIGNATURE_PENDING, CLOSED } = ApplicationStatusType;
const SCREEN_TRANSITION_DELAY = 1000;
const MODAL_TRANSITION_DELAY = 600;

const computeCaseCardComponent = (
  caseItem: Case,
  formName: string,
  colorSchema: PrimaryColor,
  navigation: { onOpenForm: (caseId: string, isSignMode?: boolean) => void },
  toggleModal: () => void,
  personalNumber: string,
  formPassword: string | undefined,
  onOpenPdf: () => void
) => {
  const {
    currentPosition: { currentMainStep: currentStep, numberOfMainSteps },
  } = caseItem?.forms[caseItem?.currentFormId];

  const caseId = caseItem.id;
  const status = caseItem?.status;
  const persons = caseItem.persons ?? [];
  const details = caseItem?.details ?? {};
  const pdf = caseItem?.pdf?.B ?? "";
  const { workflow = {}, period = {} } = details;
  const { decision = {}, payments = {} } = workflow;
  const statusType = status?.type ?? "";

  const completions = caseItem.details.completions?.requested || [];

  const isRandomCheck = statusType.includes("randomCheck");
  const completionsClarification =
    (!isRandomCheck && caseItem.details.completions?.description) || "";

  const applicationPeriodMonth = period?.endDate
    ? getSwedishMonthNameByTimeStamp(period?.endDate, true)
    : "";

  const canShowPdf = statusType.includes(CLOSED) && !!pdf;

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

  const shouldShowCTAButton = isCoApplicant
    ? isWaitingForSign && !selfHasSigned
    : isOngoing ||
      isNotStarted ||
      isRandomCheckRequired ||
      isClosed ||
      isVivaCompletionRequired ||
      isActiveSubmittedRandomCheck ||
      activeSubmittedCompletion;

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
    : null;

  const unApprovedCompletionDescriptions: string[] =
    statusType.includes("completion") || statusType.includes("randomCheck")
      ? getUnapprovedCompletionDescriptions(completions)
      : [];

  const shouldShowPin = isWaitingForSign && !isCoApplicant;

  let description = status.detailedDescription || status.description;
  if (shouldShowPin) {
    const partner = persons.find((person) => person.role === "coApplicant");
    const partnerName = partner?.firstName;
    description = `${caseItem.status.description}\n\n${partnerName} loggar in i appen med BankID och anger koden för att granska och signera er ansökan.\n\nKod till ${partnerName}:`;
  }

  return (
    <CaseCard
      colorSchema={colorSchema}
      title={applicationPeriodMonth || formName}
      subtitle={status.name}
      showProgress={isOngoing}
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
      showButton={isClosed || shouldShowCTAButton}
      buttonText={buttonProps.text}
      onButtonClick={isClosed ? toggleModal : buttonProps.onClick}
      buttonIconName={isClosed ? "remove-red-eye" : "arrow-forward"}
      completions={unApprovedCompletionDescriptions}
      completionsClarification={completionsClarification}
      showDownloadPdfButton={canShowPdf}
      onOpenPdf={onOpenPdf}
      pin={shouldShowPin ? formPassword : undefined}
    />
  );
};

const CaseSummary = (props: Props): JSX.Element => {
  const authContext = useContext(AuthContext);
  const { cases, getCase } = useContext(CaseState);
  const { deleteCase } = useContext(CaseDispatch);

  const [isBottomModalVisible, setIsBottomModalVisible] = useState(false);
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
  const { workflow = {}, administrators } = details;
  const {
    decision = {} as Decision,
    calculations = {} as Calculations,
    journals = {} as Journal,
  } = workflow as Workflow;

  const [isModalVisible, toggleModal] = useModal();
  const [showRemoveCaseModal, toggleRemoveCaseModal] = useModal();

  const decisions = decision?.decisions?.decision
    ? convertDataToArray(decision.decisions.decision)
    : [];

  const canRemoveCase =
    [ACTIVE_SIGNATURE_PENDING].includes(caseData.status.type) && isApplicant;

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

  const openForm = (id: string, isSignMode = false) => {
    navigation.navigate("Form", { caseId: id, isSignMode });
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

  const passwords = useGetFormPasswords(cases, authContext.user);

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

  const showBottomModal = useCallback(() => {
    setIsBottomModalVisible(true);
  }, []);

  const hideBottomModal = () => {
    setIsBottomModalVisible(false);
  };

  useEffect(() => {
    if (canRemoveCase) {
      navigation.setOptions({
        headerRight: () => <MoreButton onPress={showBottomModal} />,
      });
    }
  }, [navigation, canRemoveCase, showBottomModal]);

  const togglePdf = () => {
    setOpenPdf((oldValue) => !oldValue);
  };

  const addModalButton = (
    title: string,
    callback: () => void
  ): TransparentModalButton => ({
    title,
    onPress: () => {
      setIsBottomModalVisible(false);
      setTimeout(callback, MODAL_TRANSITION_DELAY);
    },
  });

  const bottomModalButtons: TransparentModalButton[] = [];

  if (canRemoveCase) {
    bottomModalButtons.push(
      addModalButton("Ta bort ansökan", handleRemoveCaseButtonClick)
    );
  }

  return (
    <ScreenWrapper {...props}>
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
            togglePdf
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

      <TransparentBottomModal
        isVisible={isBottomModalVisible}
        onCloseModal={hideBottomModal}
        modalButtons={bottomModalButtons}
      />

      <PdfModal
        isVisible={openPdf}
        toggleModal={togglePdf}
        uri={`data:application/pdf;base64,${caseData.pdf?.B}`}
      />
    </ScreenWrapper>
  );
};

export default CaseSummary;
