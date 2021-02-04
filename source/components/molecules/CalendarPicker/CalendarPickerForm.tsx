import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import styled from 'styled-components/native';
import moment from 'moment';
import 'moment/locale/sv';
import Input from '../../atoms/Input';
import { colorPalette } from '../../../styles/palette';
import { PrimaryColor } from '../../../styles/themeHelpers';
import Button from '../../atoms/Button';
import Text from '../../atoms/Text';
import { Modal, useModal } from '../Modal';

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
const DateInput = styled(Input)<{ transparent: boolean }>`
  ${({ transparent }) => transparent && 'background: transparent;'}
  text-align: right;
  min-width: 80%;
  font-weight: 500;
  color: ${(props) => props.theme.colors.neutrals[1]};
`;

interface PropInterface {
  onSelect: (date: number) => void;
  value: number;
  editable?: boolean;
  transparent?: boolean;
  style?: React.CSSProperties;
  showErrorMessage?: boolean;
  error?: { isValid: boolean; message: string };
  colorSchema: PrimaryColor;
}
const CalendarPickerForm: React.FC<PropInterface> = ({
  onSelect,
  value,
  editable = true,
  transparent,
  colorSchema,
  showErrorMessage,
  error,
  style,
}) => {
  const [modalVisible, toggleModal] = useModal();

  const handleCalendarDateChange = (selectedDate: moment.Moment) => {
    onSelect(selectedDate.toDate().valueOf());
    toggleModal();
  };

  return (
    <View>
      <TouchableOpacity disabled={!editable} onPress={toggleModal}>
        <DateInput
          placeholder="Välj datum"
          value={value ? moment.utc(value).format('Y-MM-DD') : ''}
          multiline /** Temporary fix to make field scrollable inside scrollview */
          numberOfLines={1} /** Temporary fix to make field scrollable inside scrollview */
          editable={false}
          pointerEvents="none"
          transparent={transparent}
          style={style}
          colorSchema={colorSchema}
          showErrorMessage={showErrorMessage}
          error={error}
        />
      </TouchableOpacity>

      <Modal visible={modalVisible} presentationStyle="overFullScreen" hide={toggleModal}>
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
              selectedStartDate={value ? new Date(value) : undefined}
            />
          </CalendarStyle>
        </CalendarContainer>
        <ButtonContainer>
          <Button colorSchema="blue" onClick={toggleModal}>
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
  value: PropTypes.number,
  /** Turn the input field of. Defaults to true. */
  editable: PropTypes.bool,
  /** Turn the background of input field transparent */
  transparent: PropTypes.bool,
  style: PropTypes.object,
  colorSchema: PropTypes.oneOf(['blue', 'green', 'red', 'purple', 'neutral']),
  showErrorMessage: PropTypes.bool,
  error: PropTypes.shape({
    isValid: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
  }),
};

export default CalendarPickerForm;
