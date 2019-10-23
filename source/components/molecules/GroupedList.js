import React from 'react';
import { View, SectionList, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Heading from '../atoms/Heading';
import Text from '../atoms/Text';
import ListItem from './ListItem'

export default GroupedList = props => {
    const { heading, items, onClick} = props;
    return (
        <SectionList
            ListHeaderComponent={heading ? <Header type="h3">{heading}</Header> : null}
            renderSectionHeader={({ section: { heading, data } }) => (
                <View>
                    <SectionHeader small>{heading}</SectionHeader>
                    {!(data[0].hasOwnProperty('highlighted') && data[0].highlighted === true) &&
                        <Separator />
                    }
                </View>
            )}
            scrollEnabled={false}
            sections={items}
            renderItem={(item) => <ListItem onClick={onClick} {...item.item} />}
            keyExtractor={(item, index) => index}
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

const Separator = styled(View)`
  width:100%;
  height: 1px;
  background-color: ${props => (props.theme.background.lighter)};
`;

GroupedList.propTypes = {
    heading: PropTypes.string,
    items: PropTypes.array,
    onClick: PropTypes.func,
};
