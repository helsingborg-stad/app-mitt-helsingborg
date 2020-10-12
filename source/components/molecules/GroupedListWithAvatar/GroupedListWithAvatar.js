import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import AvatarListItem from 'app/components/molecules/ListItem/AvatarListItem';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Text, Icon } from '../../atoms';

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

const HeadingWrapper = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

const GroupListWithAvatar = ({ heading, value, onChange, formId }) => {
  const [isDisable, setIsDisable] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  const updateValue = index => newValue => {
    const vs = value && value.length > 0 ? JSON.parse(JSON.stringify(value)) : [];
    vs[index] = newValue;
    onChange(vs);
  };

  const addItem = () => {
    setShowModal(true);
    const vs = value && value.length > 0 ? JSON.parse(JSON.stringify(value)) : [];
    vs.push({});
    onChange(vs);
  };

  const removeItem = index => () => {
    setShowModal(false);
    const vs = value && value.length > 0 ? JSON.parse(JSON.stringify(value)) : [];
    vs.splice(index, 1);
    onChange(vs);
  };

  const editList = () => {
    setIsDisable(!isDisable);
  };

  return (
    <>
      <View>
        <HeadingWrapper>
          <SectionHeader small>{heading}</SectionHeader>
          <TouchableHighlight onPress={editList}>
            <Icon name="create" color="#00213F" />
          </TouchableHighlight>
        </HeadingWrapper>
        <Separator />
      </View>
      {value && value.length > 0
        ? value.map((item, index) => (
            <AvatarListItem
              key={`${index}`}
              onChange={updateValue(index)}
              value={item}
              imageSrc="hello"
              removeItem={removeItem(index)}
              formId={formId}
              isDisable={isDisable}
              showModal={showModal}
            />
          ))
        : null}
      {/* {isDisable ? (
        <ButtonField text="Lägg till" iconName="add" onClick={addItem} color="blue" />
      ) : null} */}
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
