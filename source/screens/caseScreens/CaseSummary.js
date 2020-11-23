import { Icon, Text } from 'app/components/atoms';
import { Card, ScreenWrapper } from 'app/components/molecules';
import PropTypes from 'prop-types';
import React from 'react';
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
const CaseSummary = ({ navigation, route }) => {
  const colorSchema = 'red';
  const { caseData, updatedAt, currentStep, totalSteps } = route.params;
  const { startDate, endDate } = caseData.details.period;
  const { administrators } = caseData.details;
  const applicationPeriodMonth = getSwedishMonthNameByTimeStamp(startDate, true);

  return (
    <ScreenWrapper>
      <Container>
        {caseData.status === 'submitted' && (
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

        {caseData.status === 'ongoing' && (
          <>
            <SummaryHeading type="h5">Pågående ansökan</SummaryHeading>

            <Card colorSchema={colorSchema}>
              <Card.Body shadow color="neutral">
                <Card.Title>
                  Steg {currentStep} / {totalSteps}
                </Card.Title>
                <Card.Progressbar currentStep={currentStep} totalStepNumber={totalSteps} />
                <Card.Text italic>Senast uppdaterad {updatedAt}</Card.Text>
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
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      caseData: PropTypes.shape({
        details: PropTypes.shape({
          administrators: PropTypes.shape({
            map: PropTypes.func,
          }),
          period: PropTypes.shape({
            startDate: PropTypes.any,
            endDate: PropTypes.any,
          }),
        }),
        id: PropTypes.any,
        status: PropTypes.string,
      }),
      updatedAt: PropTypes.any,
      currentStep: PropTypes.any,
      totalSteps: PropTypes.any,
    }),
  }),
};

export default CaseSummary;
