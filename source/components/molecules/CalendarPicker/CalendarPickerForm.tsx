import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import styled from 'styled-components/native';
import moment from 'moment';
import 'moment/locale/sv';
import Input from '../../atoms/Input';
import { colorPalette } from '../../../styles/palette';

import Button from '../../atoms/Button';
import Text from '../../atoms/Text';
import Modal from '../Modal/Modal';

// Set localized date form.
moment.locale('sv');

const CalendarContainer = styled.View`
  flex: 1;
  padding-top: 30px;
  padding-left: 7px;
  padding-right: 7px;
`;

const CalendarStyle = styled.View`
  background-color: ${colorPalette.neutrals[7]};
  border-radius: 7px;
`;

const ButtonContainer = styled.View`
  flex: 1;
  padding-top: 12px;
  margin: 0 auto;
  justify-content: center;
`;

interface PropInterface {
  onSelect: (data: Date) => void;
  date: any;
}
const CalendarPickerForm: React.FC<PropInterface> = ({ onSelect, date }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Handle selected date and hide calendar modal.
  const handleCalendarDateChange = selectedDate => {
    onSelect(selectedDate);
    setIsVisible(!isVisible);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setIsVisible(!isVisible);
        }}
      >
        <Input
          placeholder="Välj datum"
          value={date ? moment(date).format('Y-MM-DD') : undefined}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>

      <Modal visible={isVisible} presentationStyle="overFullScreen">
        <CalendarContainer>
          <CalendarStyle>
            <CalendarPicker
              onDateChange={handleCalendarDateChange}
              weekdays={['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön']}
              months={[
                'Januari',
                'Februari',
                'Mars',
                'April',
                'Maj',
                'Juni',
                'Juli',
                'Augusti',
                'September',
                'Oktober',
                'November',
                'December',
              ]}
              startFromMonday
              selectedDayColor={colorPalette.primary.blue[1]}
              selectedDayTextColor={colorPalette.neutrals[7]}
              textStyle={{
                fontFamily: 'Roboto',
                fontWeight: '500',
              }}
              previousTitle="Tidigare"
              nextTitle="Nästa"
              selectedStartDate={date ? new Date(date) : undefined}
            />
          </CalendarStyle>
        </CalendarContainer>
        <ButtonContainer>
          <Button colorSchema="blue" onClick={() => setIsVisible(false)}>
            <Text>Avbryt</Text>
          </Button>
        </ButtonContainer>
      </Modal>
    </View>
  );
};

CalendarPickerForm.propTypes = {
  /**
   * Calendar date change callback.
   */
  onSelect: PropTypes.func,
  /**
   * Date value. Used for storing and displaying date in components.
   */
  date: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.string]),
};

export default CalendarPickerForm;
