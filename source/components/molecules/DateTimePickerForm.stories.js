import React, { Component } from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from './StoryWrapper';
import withChatForm from '../organisms/withChatForm';
import DateTimePickerForm from './DateTimePickerForm';

class DateTimePicker extends Component {
  state = {
    inputValue: '',
  };

  changeHandler = inputValue => {
    this.setState(prevState => ({
      inputValue,
    }));
  };

  submitHandler = () => {
    alert(this.state.inputValue);
  };

  render() {
    return (
      <DateTimePickerForm
        inputValue={this.state.inputValue}
        changeHandler={this.changeHandler}
        submitHandler={this.submitHandler}
        mode="datetime"
        placeholder="Date time"
        selectorProps={{
          minuteInterval: 30,
          locale: 'sv',
          minimumDate: new Date(),
        }}
      />
    );
  }
}

class DatePicker extends Component {
  state = {
    inputValue: '',
  };

  changeHandler = inputValue => {
    this.setState(prevState => ({
      inputValue,
    }));
  };

  submitHandler = () => {
    alert(this.state.inputValue);
  };

  render() {
    return (
      <DateTimePickerForm
        inputValue={this.state.inputValue}
        changeHandler={this.changeHandler}
        submitHandler={this.submitHandler}
        placeholder="Date"
        mode="date"
        selectorProps={{
          locale: 'sv',
          minimumDate: new Date(),
        }}
      />
    );
  }
}

class TimePicker extends Component {
  state = {
    inputValue: '',
  };

  changeHandler = inputValue => {
    this.setState(prevState => ({
      inputValue,
    }));
  };

  submitHandler = () => {
    alert(this.state.inputValue);
  };

  render() {
    return (
      <DateTimePickerForm
        inputValue={this.state.inputValue}
        changeHandler={this.changeHandler}
        submitHandler={this.submitHandler}
        mode="time"
        placeholder="Time"
        selectorProps={{
          locale: 'sv',
          minuteInterval: 30,
        }}
      />
    );
  }
}

storiesOf('Date time picker', module)
  .add('Date time picker', () => (
    <StoryWrapper>
      <DateTimePicker />
    </StoryWrapper>
  ))
  .add('Date picker', () => (
    <StoryWrapper>
      <DatePicker />
    </StoryWrapper>
  ))
  .add('Time picker', () => (
    <StoryWrapper>
      <TimePicker />
    </StoryWrapper>
  ));
