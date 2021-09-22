import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';
import Text from '../../atoms/Text';
import Modal from '../Modal/Modal';
// top: ${props => (props.top ? `${props.top}px` : '40px')};

const DayPicker = (
  <View>
    <Calendar />
  </View>
);

export default DayPicker;
