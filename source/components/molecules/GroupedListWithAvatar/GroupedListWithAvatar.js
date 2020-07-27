import React from 'react';
import { View, SectionList } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import AvatarListItem from 'app/components/molecules/ListItem/AvatarListItem';
import Text from '../../atoms/Text';
import Button from '../../atoms/Button';
import Icon from '../../atoms/Icon';

const SectionHeader = styled(Text)`
  margin-left: 15px;
  margin-bottom: 15px;
  color: ${props => props.theme.list.onLightBackground.listWithAvatar.headerColor};
`;

// TODO: Dynamically set separator width.
const Separator = styled(View)`
  width: 75%;
  height: ${props => props.theme.list.onLightBackground.listWithAvatar.headerBorderHeight};
  margin-right: 15px;
  margin-left: 15px;
  margin-bottom: 15px;
  background-color: ${props =>
    props.theme.list.onLightBackground.listWithAvatar.headerSeparatorBackground};
`;

const ButtonWrapper = styled(View)`
  margin-left: 80%;
`;

const GroupListWithAvatar = ({ heading, value, onChange, formId }) => {
  const updateValue = index => newValue => {
    const vs = value && value.length > 0 ? JSON.parse(JSON.stringify(value)) : [];
    vs[index] = newValue;
    onChange(vs);
  };
  const addItem = () => {
    const vs = value && value.length > 0 ? JSON.parse(JSON.stringify(value)) : [];
    vs.push({});
    onChange(vs);
  };
  const removeItem = index => () => {
    const vs = value && value.length > 0 ? JSON.parse(JSON.stringify(value)) : [];
    vs.splice(index, 1);
    onChange(vs);
  };
  return (
    <>
      <View>
        <SectionHeader small>{heading}</SectionHeader>
        <Separator />
      </View>
      {value && value.length > 0
        ? value.map((item, index) => (
            <AvatarListItem
              onChange={updateValue(index)}
              value={item}
              imageSrc="hello"
              removeItem={removeItem(index)}
              formId={formId}
            />
          ))
        : null}
      <ButtonWrapper>
        <Button size="small" pill icon onClick={addItem}>
          <Icon name="add"></Icon>
        </Button>
      </ButtonWrapper>
    </>
  );
};

GroupListWithAvatar.propTypes = {
  /**
   * Heading to display above list
   */
  heading: PropTypes.string,
  /**
   * List items to display.
   */
  value: PropTypes.array.isRequired,
  /**
   * onClick handler for list items.
   */
  onChange: PropTypes.func,
  /**
   * What form to open
   */
  formId: PropTypes.string,
};

GroupListWithAvatar.defaultProps = {
  onChange: null,
};

export default GroupListWithAvatar;
