import React, { useState } from 'react';
import { StyleSheet, Modal, View, TouchableHighlight, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Text, Icon, Heading, Button } from 'app/components/atoms';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    width: '100%',
    color: 'gray',
  },
  textContainer: {
    flex: 1,
    padding: 10,
    textAlign: 'justify',
    height: '100%',
  },
  closeButton: {
    top: 0,
    color: 'gray',
  },
  infoContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

const CenteredView = styled.View({
  marginTop: 10,
});

const ModalView = styled.View({
  backgroundColor: 'white',
  padding: 20,
  alignItems: 'center',
});

const CloseButton = styled.View({
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'space-between',
  paddingLeft: '40%',
  paddingBottom: 20,
});

const InfoText = props => {
  const { text, size, heading, textHeading } = props;
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Modal
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
        presentationStyle="pageSheet"
      >
        <CenteredView>
          <ModalView>
            <CloseButton>
              <Heading type="h2" style={{ margin: 10 }}>
                {heading}
              </Heading>
              <TouchableHighlight
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
                underlayColor="#f2f2f2"
              >
                <Icon style={styles.closeButton} name="close" size={48} />
              </TouchableHighlight>
            </CloseButton>
            <ScrollView>
              <View style={styles.infoContainer}>
                <Icon style={styles.icon} name="info" size={48} />
                <View style={styles.textContainer}>
                  <Heading type="h3">{textHeading}</Heading>
                  <Text>{text}</Text>
                </View>
              </View>
            </ScrollView>
            <Button color="purpleLight" z={3} onClick={() => setModalVisible(false)}>
              <Text>Stäng</Text>
            </Button>
          </ModalView>
        </CenteredView>
      </Modal>
      <TouchableHighlight
        onPress={() => {
          // eslint-disable-next-line no-unused-expressions
          setModalVisible(true);
        }}
        underlayColor="white"
      >
        <Icon name="help-outline" size={size} />
      </TouchableHighlight>
    </>
  );
};

InfoText.propTypes = {
  text: PropTypes.string,
  size: PropTypes.number,
  heading: PropTypes.string,
  textHeading: PropTypes.string,
};

InfoText.defaultProps = {
  text: 'No text available',
  textHeading: '',
  size: 32,
  heading: '',
};

export default InfoText;
