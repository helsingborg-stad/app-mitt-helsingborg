import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { useFocusEffect } from '@react-navigation/native';
import { Modal, useModal } from 'app/components/molecules/Modal';

import Wrapper from 'app/components/molecules/Dialog/Wrapper';
import Heading from 'app/components/atoms/Heading';
import Body from 'app/components/molecules/Dialog/Body';
import BackgroundBlur from 'app/components/molecules/Dialog/BackgroundBlur';
import Button from 'app/components/atoms/Button';
import icons from '../../helpers/Icons';
import { Text } from '../../components/atoms';
import { Card, CaseCard, Header, ScreenWrapper } from '../../components/molecules';
import { getSwedishMonthNameByTimeStamp } from '../../helpers/DateHelpers';
import { CaseState, caseTypes } from '../../store/CaseContext';
import FormContext from '../../store/FormContext';
import { convertDataToArray, calculateSum } from '../../helpers/FormatVivaData';
import AuthContext from '../../store/AuthContext';
import { put } from '../../helpers/ApiRequest';

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



const ListHeading = styled(Text)`
  margin-left: 4px;
  margin-top: 24px;
  margin-bottom: 8px;
`;

Card.MessageBody = styled(Card.Body)`
  background-color: ${(props) => props.theme.colors.neutrals[5]};
`;

const colorSchema = 'red';

/**
 * Returns a case card component depending on it's status
 * @param {obj} caseData
 * @param {obj} navigation
 * @param {obj} authContext
 * @param {object?} extra Extra properties
 * @param {function?} extra.toggleCoApplicantModal Function to run in order to toggle the co-applicant modal
 */
const computeCaseCardComponent = (caseData, navigation, authContext, extra) => {
  const currentStep =
    caseData?.forms?.[caseData.currentFormId]?.currentPosition?.currentMainStep || 0;
  const totalSteps = caseData.form?.stepStructure ? caseData.form.stepStructure.length : 0;
  const {
    details: {
      period = {},
      workflow: { decision = {}, payments = {}, application = {} } = {},
    } = {},
    persons = [],
  } = caseData;

  const applicationPeriodTimestamp = application?.periodenddate ?? period?.endDate;
  const applicationPeriodMonth = applicationPeriodTimestamp
    ? getSwedishMonthNameByTimeStamp(applicationPeriodTimestamp, true)
    : '';

  const decisions = decision?.decisions?.decision
    ? convertDataToArray(decision.decisions.decision)
    : [];

  const paymentsArray = decisions.filter((decision) => decision.typecode === '01');
  const partiallyApprovedDecisionsAndRejected = decisions.filter((decision) =>
    ['03', '02'].includes(decision.typecode)
  );

  const casePersonData = persons.find(
    (person) => person.personalNumber === authContext.user.personalNumber
  );
  
  const statusType = caseData?.status?.type || '';
  const isNotStarted = statusType.includes('notStarted');
  const isOngoing = statusType.includes('ongoing');
  const isCompletionRequired = statusType.includes('completionRequired');
  const isSigned = statusType.includes('signed');
  const isClosed = statusType.includes('closed');
  const isWaitingForSign = statusType.includes('active:signature:pending');
  const selfHasSigned = casePersonData?.hasSigned;
  const isCoApplicant = casePersonData?.role === 'coApplicant';

  const isWaitingForCoApplicantSign = !!caseData?.forms[caseData.currentFormId].encryption.symmetricKeyName

  const shouldShowCTAButton = isCoApplicant
    ? isWaitingForSign && !selfHasSigned
    : isOngoing || isNotStarted || isCompletionRequired || isSigned;

  const buttonProps = {
    onClick: () => navigation.navigate('Form', { caseId: caseData.id }),
    text: '',
  };

  if (isOngoing) {
    buttonProps.text = 'Fortsätt';
  }

  if (isNotStarted) {
    buttonProps.text = 'Starta ansökan';

    if (isWaitingForCoApplicantSign) {
      buttonProps.onClick = () => {
        if (extra && extra.toggleCoApplicantModal) extra.toggleCoApplicantModal()
      }
    }
  }

  if (isCompletionRequired) {
    buttonProps.text = 'Starta stickprov';
  }

  if (isSigned) {
    buttonProps.text = 'Ladda upp filer och dokument';
  }

  if (isWaitingForSign && !selfHasSigned) {
    buttonProps.onClick = () =>
      navigation.navigate('Form', { caseId: caseData.id, isSignMode: true });
    buttonProps.text = 'Granska och signera';
  }

  const giveDate = payments?.payment?.givedate
    ? `${payments.payment.givedate.split('-')[2]} ${getSwedishMonthNameByTimeStamp(
        payments.payment.givedate,
        true
      )}`
    : null;

  return (
    <CaseCard
      key={caseData.id}
      colorSchema={colorSchema}
      title={caseData.caseType.name}
      subtitle={caseData.status.name}
      month={applicationPeriodMonth}
      largeSubtitle={applicationPeriodMonth}
      icon={icons[caseData.caseType.icon]}
      showButton={shouldShowCTAButton}
      buttonText={buttonProps.text}
      currentStep={currentStep}
      totalSteps={totalSteps}
      showPayments={isClosed}
      showProgress={isOngoing}
      payments={calculateSum(paymentsArray)}
      declined={calculateSum(partiallyApprovedDecisionsAndRejected)}
      givedate={giveDate}
      onCardClick={() => {
        navigation.navigate('UserEvents', {
          screen: caseData.caseType.navigateTo,
          params: {
            id: caseData.id,
            name: caseData.caseType.name,
          },
        });
      }}
      onButtonClick={buttonProps.onClick}
    />
  );
};

/**
 * Case overview screen
 * @param {obj} props
 */
function CaseOverview(props) {
  const { navigation } = props;
  const [caseItems, setCaseItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingCaseSign, setPendingCaseSign] = useState(null);
  const { cases, getCasesByFormIds, fetchCases } = useContext(CaseState);
  const { getForm, getFormIdsByFormTypes } = useContext(FormContext);
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const [showCoSignModal, toggleShowCoSignModal] = useModal();

  const authContext = useContext(AuthContext);

  const wait = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

  const getCasesByStatuses = (statuses) =>
    caseItems.filter((caseData) => {
      let matchesStatus = false;
      statuses.forEach((status) => {
        matchesStatus = matchesStatus || caseData?.status?.type?.includes(status);
      });
      return matchesStatus;
    });

  const activeCases = getCasesByStatuses(['notStarted', 'active']);
  const closedCases = getCasesByStatuses(['closed']);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCases();
    wait(500).then(() => {
      setRefreshing(false);
    });
  }, [fetchCases]);

  useFocusEffect(
    useCallback(() => {
      // Sometimes new cases is not created in an instant.
      // Due to this we have to give the api some time before we try to fetch cases,
      // since we cannot react to changes as of now.
      const milliseconds = 4000;
      wait(milliseconds).then(() => {
        fetchCases();
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
          return { ...caseData, caseType, form };
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

    updateItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cases]);

  useEffect(() => {
    if (pendingCaseSign && authContext.status === 'signResolved') {
      (async () => {
        const currentForm = pendingCaseSign.forms[pendingCaseSign.currentFormId];

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
          navigation.navigate('Form', {
            caseId: pendingCaseSign.id,
          });
        } catch (error) {
          console.log(`Could not update case with new signature: ${error}`);
        }
      })();
    }
  }, [pendingCaseSign, authContext.status, setPendingCaseSign, onRefresh, navigation]);

  return (
    <ScreenWrapper {...props}>
      <Header title="Mina ärenden" />
      <Modal
        visible={!showCoSignModal}
        hide={() => toggleShowCoSignModal()}
        transparent
        presentationStyle="overFullScreen"
        animationType="fade"
        statusBarTranslucent
      >
      <Wrapper>
        <DialogContainer>
          <Heading type='h4'>Bekräftelse behövs</Heading>
          <Text align='center'>
            För att starta ansökan måste [medsökandes namn] bekräfta att ni söker tillsammans.
            [Medsökandes namn] bekräftar genom att logga in i appen Mitt Helsingborg.
          </Text>
          <ButtonContainer>
          <PopupButton onClick={() => toggleShowCoSignModal()} block colorSchema="red">
            <Text>Okej</Text>
          </PopupButton>
          <PopupButton onClick={() => toggleShowCoSignModal()} block colorSchema="neutral">
            <Text>Avbryt</Text>
          </PopupButton>
          </ButtonContainer>
        </DialogContainer>
        <BackgroundBlur blurType="light" blurAmount={15} reducedTransparencyFallbackColor="white" />
      </Wrapper>
    </Modal>
      <Container refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <ListHeading type="h5">Aktiva</ListHeading>
        {activeCases.length > 0 && (
          <Animated.View style={{ opacity: fadeAnimation }}>
            {activeCases.map((caseData) =>
              computeCaseCardComponent(caseData, navigation, authContext, { toggleCoApplicantModal: toggleShowCoSignModal })
            )}
          </Animated.View>
        )}

        {!isLoading && activeCases.length === 0 && (
          <Animated.View style={{ opacity: fadeAnimation }}>
            <Card>
              <Card.MessageBody>
                <Card.Text>Du har inga aktiva ärenden.</Card.Text>
              </Card.MessageBody>
            </Card>
          </Animated.View>
        )}

        {closedCases.length > 0 && (
          <Animated.View style={{ opacity: fadeAnimation }}>
            <ListHeading type="h5">Avslutade</ListHeading>
            {closedCases.map((caseData) =>
              computeCaseCardComponent(caseData, navigation, authContext)
            )}
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
