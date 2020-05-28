import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native';
import { ScreenWrapper, BackNavigation } from 'app/components/molecules';

const FormScreenWrapper = styled(ScreenWrapper)`
  padding: 0;
  background-color: #f5f5f5;
  flex: 1;
`;

const FormCaseScreen = props => {
  const {
    navigation: { navigate },
  } = props;

  return (
    <SafeAreaView>
      <FormScreenWrapper>
        <BackNavigation
          isBackBtnVisible={false}
          onClose={async () => {
            navigate('Start');
          }}
        />
      </FormScreenWrapper>
    </SafeAreaView>
  );
};

FormCaseScreen.propTypes = {
  navigation: PropTypes.object,
};

export default FormCaseScreen;
