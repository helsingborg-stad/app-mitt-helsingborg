import { Icon, Text } from 'app/components/atoms';
import { Card, ScreenWrapper } from 'app/components/molecules';
import { CaseState } from 'app/store/CaseContext';
import FormContext from 'app/store/FormContext';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { formatUpdatedAt, getSwedishMonthNameByTimeStamp } from '../../helpers/DateHelpers';

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
const CaseSummary = props => {
  const { getCase } = useContext(CaseState);
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

  const {
    status,
    currentStep: { currentMainStep: currentStep } = {},
    details: { administrators, period: { startDate, endDate } = {} } = {},
    updatedAt,
  } = caseData;

  const { name: formName } = form;
  const totalSteps = form?.stepStructure?.length;
  const applicationPeriodMonth = getSwedishMonthNameByTimeStamp(startDate, true);

  useEffect(() => {
    const caseData = getCase(caseId);
    setCaseData(caseData);

    const getFormObject = async id => {
      setForm(await getForm(id));
    };

    getFormObject(caseData.formId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId, status]);

  return (
    <ScreenWrapper>
      <Container>
        {status === 'submitted' && (
          <>
            <SummaryHeading type="h5">Aktuell period</SummaryHeading>
            <Card colorSchema={colorSchema}>
              <Card.Body shadow color="neutral">
                <Card.Title>{applicationPeriodMonth}</Card.Title>
                <Card.SubTitle>Ansökan inlämnad</Card.SubTitle>
                <Card.Text>
                  Vi har mottagit din ansökan för perioden{' '}
                  {`${formatUpdatedAt(startDate)} - ${formatUpdatedAt(endDate)}`}.
                </Card.Text>
                <Card.Text italic>
                  Vi skickar ut en notis när status för din ansökan ändras.
                </Card.Text>
              </Card.Body>
            </Card>

            {/* Mock data, needs to be replaced */}
            <SummaryHeading type="h5">Nästa period</SummaryHeading>
            <Card>
              <Card.Text italic>Du kan ansöka om nästa period från den 10 oktober.</Card.Text>
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
                <Card.Progressbar currentStep={currentStep} totalStepNumber={totalSteps} />
                <Card.Text italic>Senast uppdaterad {formatUpdatedAt(updatedAt)}</Card.Text>
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
          </>
        )}

        {administrators && (
          <View>
            <SummaryHeading type="h5">Mina kontaktpersoner</SummaryHeading>
            {administrators.map(({ name, title, phone, email }) => (
              <Card colorSchema={colorSchema}>
                <Card.Body shadow color="neutral">
                  {name && <Card.Title>{name}</Card.Title>}
                  {title && <Card.SubTitle>{title}</Card.SubTitle>}
                  {phone && <Card.Text>{phone}</Card.Text>}
                  {email && <Card.Text>{email}</Card.Text>}
                </Card.Body>
              </Card>
            ))}
          </View>
        )}

        {/* Mock data, needs to be replaced */}
        <SummaryHeading type="h5">Tidigare ansökningar</SummaryHeading>
        <Card colorSchema={colorSchema}>
          <Card.Text italic>Här kan du titta på dina tidigare ansökningar.</Card.Text>
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
