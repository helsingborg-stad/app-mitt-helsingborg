import React from 'react';
import { View, SectionList } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import AvatarListItem from 'app/components/molecules/ListItem/AvatarListItem';
import Text from '../../atoms/Text';

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

const GroupListWithAvatar = props => {
  const { items, onClick } = props;
  return (
    <SectionList
      renderSectionHeader={({ section: { heading, data } }) => (
        <View>
          <SectionHeader small>{heading}</SectionHeader>
          <Separator />
        </View>
      )}
      scrollEnabled={false}
      sections={items}
      renderItem={item => <AvatarListItem onClick={onClick} {...item.item} />}
      keyExtractor={(item, index) => index}
    />
  );
};

GroupListWithAvatar.propTypes = {
  items: PropTypes.array.isRequired,
  onClick: PropTypes.func,
};

GroupListWithAvatar.defaultProps = {
  onClick: null,
};

export default GroupListWithAvatar;
