import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
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

const computeCaseCardComponent = (caseData, form, colorSchema, navigation) => {
  const {
    status,
    currentPosition: { currentMainStep: currentStep } = {},
    details: { period: { endDate } = {} } = {},
  } = caseData;
  const totalSteps = form?.stepStructure?.length || 0;
  const applicationPeriodMonth = getSwedishMonthNameByTimeStamp(endDate, true);

  if (status?.type?.includes('ongoing')) {
    return (
      <Card colorSchema={colorSchema}>
        <Card.Body shadow color="neutral">
          <Card.Title colorSchema="neutral">{applicationPeriodMonth}</Card.Title>
          <Card.SubTitle>
            Steg {currentStep} / {totalSteps}
          </Card.SubTitle>
          <Card.Progressbar currentStep={currentStep} totalStepNumber={totalSteps} />
          <Card.Text>{status.description} </Card.Text>
          <Card.Button
            onClick={() => {
              navigation.navigate('Form', { caseId: caseData.id });
            }}
          >
            <Text>Fortsätt ansökan</Text>
            <Icon name="arrow-forward" />
          </Card.Button>
        </Card.Body>
      </Card>
    );
  }

  if (status?.type?.includes('notStarted')) {
    return (
      <Card colorSchema={colorSchema}>
        <Card.Body shadow color="neutral">
          <Card.Title colorSchema="neutral">{applicationPeriodMonth}</Card.Title>
          <Card.SubTitle>{status.name}</Card.SubTitle>
          <Card.Text>{status.description} </Card.Text>
          <Card.Button
            onClick={() => {
              navigation.navigate('Form', { caseId: caseData.id });
            }}
          >
            <Text>Starta ansökan</Text>
            <Icon name="arrow-forward" />
          </Card.Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card colorSchema={colorSchema}>
      <Card.Body shadow color="neutral">
        <Card.Title colorSchema="neutral">{applicationPeriodMonth}</Card.Title>
        <Card.SubTitle>{status.name}</Card.SubTitle>
        <Card.Text>{status.description} </Card.Text>
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
  const { details: { administrators } = {} } = caseData;
  const isFocused = useIsFocused();

  useEffect(() => {
    const caseData = getCase(caseId);
    setCaseData(caseData);

    const getFormObject = async (id) => {
      setForm(await getForm(id));
    };

    getFormObject(caseData.formId);
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
          computeCaseCardComponent(caseData, form, colorSchema, navigation)}

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
