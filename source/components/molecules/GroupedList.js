import React from 'react';
import { View, SectionList, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Heading from '../atoms/Heading';
import Text from '../atoms/Text';
import Icon from '../atoms/Icon';

export default GroupedList = props => {
  renderItem = item =>
    <ListItem underlayColor="#FFF" onPress={() => console.log(item.id)}>
      <Flex>
        {props.icon && props.iconPosition === 'left' &&
          <ListIcon name={props.icon} iconPosition={props.iconPosition} />
        }
        <View>
          {item.title &&
            <ItemHeader small>{item.title}</ItemHeader>
          }
          {item.text &&
            <Text>{item.text}</Text>
          }
        </View>
        {props.icon && props.iconPosition === 'right' &&
          <ListIcon name={props.icon} iconPosition={props.iconPosition} />
        }
      </Flex>
    </ListItem>;

  return (
    <SectionList
      ListHeaderComponent={props.heading ? <Header type="h3">{props.heading}</Header> : null}
      renderSectionHeader={({ section: { heading } }) => (
        <View>
          <SectionHeader small>{heading}</SectionHeader>
          <Separator />
        </View>
      )}
      scrollEnabled={false}
      sections={props.items}
      renderItem={item => renderItem(item.item)}
      keyExtractor={item => item.id}
    />
  );
}

const Separator = styled(View)`
  width:100%;
  height: 1px;
  background-color: ${props => (props.theme.background.lighter)};
`;

const Header = styled(Heading)`
  margin-left: 4px;
  margin-bottom: 8px;
`;

const SectionHeader = styled(Text)`
  margin: 16px;
  margin-left: 4px;
  color: ${props => (props.theme.background.light)};
`;

const ItemHeader = styled(Text)`
  color: ${props => (props.theme.background.darkest)};
  margin-bottom: 4px;
`;

const ListItem = styled(TouchableHighlight)`
  padding: 16px;
  borderBottomWidth: 1;
  borderColor: ${props => (props.theme.background.lighter)};
`;

const Flex = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const ListIcon = styled(Icon)`
  color: ${props => (props.theme.background.light)};
  ${({ iconPosition }) => iconPosition && iconPosition === 'right' && `
    margin-left: auto;
  `}
  ${({ iconPosition }) => iconPosition && iconPosition === 'left' && `
    margin-right: 16px;
  `}
`;

GroupedList.propTypes = {
  heading: PropTypes.string,
  icon: PropTypes.string,
  items: PropTypes.array,
  iconPosition: PropTypes.string,
};

GroupedList.defaultProps = {
  iconPosition: 'right'
};




