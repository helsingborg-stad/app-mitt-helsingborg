import {Icon, Text} from '../../components/atoms';
import {Card, ScreenWrapper} from '../../components/molecules';
import {CaseState} from '../../store/CaseContext';
import FormContext from '../../store/FormContext';
import PropTypes from 'prop-types';
import React, {useContext, useEffect, useState, useRef} from 'react';
import {View, Animated, Easing} from 'react-native';
import styled from 'styled-components/native';
import icons from '../../helpers/Icons';
import {launchPhone, launchEmail} from '../../helpers/LaunchExternalApp';
import {
  formatUpdatedAt,
  getSwedishMonthNameByTimeStamp,
} from '../../helpers/DateHelpers';

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

/**
 * Case summary screen
 * @param {obj} props
 */
const CaseSummary = (props) => {
  const {getCase} = useContext(CaseState);
  const {getForm} = useContext(FormContext);

  const [caseData, setCaseData] = useState({});
  const [form, setForm] = useState({});

  const {
    colorSchema,
    navigation,
    route: {
      params: {id: caseId},
    },
  } = props;

  const {
    status,
    currentPosition: {currentMainStep: currentStep} = {},
    details: {administrators, period: {startDate, endDate} = {}} = {},
    updatedAt,
  } = caseData;

  const {name: formName} = form;
  const totalSteps = form?.stepStructure?.length || 0;
  const applicationPeriodMonth = getSwedishMonthNameByTimeStamp(
    startDate,
    true,
  );

  useEffect(() => {
    const caseData = getCase(caseId);
    setCaseData(caseData);

    const getFormObject = async (id) => {
      setForm(await getForm(id));
    };

    getFormObject(caseData.formId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId, status]);

  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      easing: Easing.back(),
      duration: 400,
    }).start();
  }, [fadeAnimation]);

  return (
    <ScreenWrapper>
      <Container as={Animated.ScrollView} style={{opacity: fadeAnimation}}>
        {status === 'submitted' && (
          <>
            <SummaryHeading type="h5">Aktuell period</SummaryHeading>
            <Card colorSchema={colorSchema}>
              <Card.Body shadow color="neutral">
                <Card.Title>{applicationPeriodMonth}</Card.Title>
                <Card.SubTitle>Ansökan inlämnad</Card.SubTitle>
                <Card.Text>
                  Vi har mottagit din ansökan för perioden{' '}
                  {`${formatUpdatedAt(startDate)} - ${formatUpdatedAt(
                    endDate,
                  )}`}
                  .
                </Card.Text>
                <Card.Text italic>
                  Vi skickar ut en notis när status för din ansökan ändras.
                </Card.Text>
              </Card.Body>
            </Card>

            {/* TODO: Mock data, needs to be replaced */}
            <SummaryHeading type="h5">Nästa period</SummaryHeading>
            <Card>
              <Card.Text italic>
                Du kan ansöka om nästa period från den 10 oktober.
              </Card.Text>
            </Card>
          </>
        )}

        {status === 'ongoing' && (
          <>
            <SummaryHeading type="h5">Pågående ansökan</SummaryHeading>

            <Card colorSchema={colorSchema}>
              <Card.Body shadow color="neutral">
                <Card.Title>{formName}</Card.Title>
                <Card.SubTitle>
                  Steg {currentStep} / {totalSteps}
                </Card.SubTitle>
                <Card.Progressbar
                  currentStep={currentStep}
                  totalStepNumber={totalSteps}
                />
                <Card.Text italic>
                  Senast uppdaterad {formatUpdatedAt(updatedAt)}
                </Card.Text>
                <Card.Button
                  onClick={() => {
                    navigation.navigate('Form', {caseId: caseData.id});
                  }}>
                  <Text>Fortsätt ansökan</Text>
                  <Icon name="arrow-forward" />
                </Card.Button>
              </Card.Body>
            </Card>
          </>
        )}

        {administrators && (
          <View>
            <SummaryHeading type="h5">Mina kontaktpersoner</SummaryHeading>
            {administrators.map(({name, title, phone, email}) => (
              <Card key={`${name}`} colorSchema={colorSchema}>
                <Card.Body shadow color="neutral">
                  <Card.Section>
                    <Card.Image
                      style={{width: 50, height: 50}}
                      circle
                      source={icons.ICON_CONTACT_PERSON}
                    />
                    {name && <Card.Title>{name}</Card.Title>}
                    {title && <Card.SubTitle>{title}</Card.SubTitle>}
                  </Card.Section>
                  {phone && (
                    <Card.Button
                      colorSchema="neutral"
                      onClick={() => launchPhone(phone)}>
                      <Icon name="phone" />
                      <Text>{phone}</Text>
                    </Card.Button>
                  )}
                  {email && (
                    <Card.Button
                      colorSchema="neutral"
                      onClick={() => launchEmail(email)}>
                      <Icon name="email" />
                      <Text>{email}</Text>
                    </Card.Button>
                  )}
                </Card.Body>
              </Card>
            ))}
          </View>
        )}

        {/* TODO: Mock data, needs to be replaced */}
        <SummaryHeading type="h5">Tidigare ansökningar</SummaryHeading>
        <Card colorSchema={colorSchema}>
          <Card.Text italic>
            Här kan du titta på dina tidigare ansökningar.
          </Card.Text>
          <Card.Button>
            <Text>1-30 september</Text>
            <Icon name="arrow-forward" />
          </Card.Button>
          <Card.Button>
            <Text>1-31 augusti</Text>
            <Icon name="arrow-forward" />
          </Card.Button>
        </Card>
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
