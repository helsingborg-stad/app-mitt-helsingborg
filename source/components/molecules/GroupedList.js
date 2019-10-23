import React from 'react';
import { View, SectionList, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Heading from '../atoms/Heading';
import Text from '../atoms/Text';
import ListItem from './ListItem'

export default GroupedList = props => {
    return (
        <SectionList
            ListHeaderComponent={props.heading ? <Header type="h3">{props.heading}</Header> : null}
            renderSectionHeader={({ section: { heading } }) => (
                <View>
                    <SectionHeader small>{heading}</SectionHeader>
                </View>
            )}
            scrollEnabled={false}
            sections={props.items}
            renderItem={item => <ListItem {...item.item} />}
            keyExtractor={item => item.id}
        />
    );
}

const Header = styled(Heading)`
  margin-left: 4px;
  margin-bottom: 8px;
`;

const SectionHeader = styled(Text)`
  margin: 16px;
  margin-left: 4px;
  color: ${props => (props.theme.background.light)};
`;

GroupedList.propTypes = {
    heading: PropTypes.string,
    items: PropTypes.array,
};
