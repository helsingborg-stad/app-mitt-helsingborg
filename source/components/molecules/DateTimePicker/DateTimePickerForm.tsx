import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, TouchableOpacity, Platform } from 'react-native';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';
import Text from '../../atoms/Text';
import Modal from '../Modal/Modal';
// top: ${props => (props.top ? `${props.top}px` : '40px')};

const ContentContainer = styled.View`
  flex: 1;
  padding-top: 30px;
  padding-left: 12px;
  padding-right: 12px;
  justify-content: center;
  position: relative;
`;
const ButtonContainer = styled.View`
  flex: 1;
  padding-top: 12px;
  margin: 0 auto;
  justify-content: center;
`;

interface Props {
  onSelect: (date: Date) => void;
  value: string | number;
  mode: 'datetime' | 'time' | 'date';
  color: string;
  selectorProps: Record<string, any>;
}

const DateTimePickerForm: React.FC<Props> = ({
  onSelect,
  value,
  mode,
  selectorProps,
  color,
  ...other
}) => {
  const [isVisible, setIsVisible] = useState(false);

  let dateTimeString: string;
  const date = value ? new Date(value) : new Date();

  const dateString = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}`;
  const timeString = `${date
    .getHours()
    .toString()
    .padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
  if (value) {
    switch (mode) {
      case 'datetime':
        dateTimeString = `${dateString} ${timeString}`;
        break;

      case 'time':
        dateTimeString = timeString;
        break;

      default:
        dateTimeString = dateString;
    }
  }

  const onChange = (date: Date) => {
    setIsVisible(Platform.OS === 'ios');
    onSelect(date);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setIsVisible(!isVisible);
          onSelect(date);
        }}
      >
        <Input
          placeholder="åååå-mm-dd"
          editable
          value={dateTimeString}
          pointerEvents="none"
          center
          color={color}
          {...other}
        />
      </TouchableOpacity>
      <Modal visible={isVisible} presentationStyle="overFullScreen">
        <ContentContainer>
          <DateTimePicker
            value={date}
            onChange={(_event, x) => onSelect(x)}
            mode={mode}
            textColor="white"
            {...selectorProps}
          />
        </ContentContainer>
        <ButtonContainer>
          <Button color="green" onClick={() => setIsVisible(false)}>
            <Text>Spara</Text>
          </Button>
        </ButtonContainer>
      </Modal>
    </View>
  );
};

DateTimePickerForm.propTypes = {
  /**
   * Function to set input date value
   */
  onSelect: PropTypes.func,
  /**
   * Value from the date picker
   */
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  /**
   * Defines the type of date picker
   */
  mode: PropTypes.string,
  /**
   * Is an object that can define the locale, minuteInterval or minimumDate
   */
  selectorProps: PropTypes.object,
  /**
   * Sets the color theme, default is light.
   */
  color: PropTypes.string,
};

DateTimePickerForm.defaultProps = {
  value: '',
};

export default DateTimePickerForm;
