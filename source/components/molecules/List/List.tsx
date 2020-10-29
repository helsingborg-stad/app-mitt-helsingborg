import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { FieldLabel, Text } from '../../atoms';
import theme from '../../../styles/theme';
import HelpButton from '../HelpButton/HelpButton';

const ListWrapper = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  border-radius: 9.5px;
  overflow: hidden;
  margin-bottom: 16px;
  margin-top: 16px;
`;

const ListHeader = styled.View`
  padding-left: 24px;
  padding-right: 12px;
  padding-top: 12px;
  padding-bottom: 10px;
  position: relative;
  flex-direction: row;
  align-items: center;
  min-height: 58px;
`;

const HeaderTitleWrapper = styled.View`
  flex-direction: row;
  flex: 1;
`;

const HeaderTitle = styled(Text)`
  font-weight: 900;
  font-size: 14px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
`;

const ListBody = styled.View`
  padding-top: 12px;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  height: auto;
`;

const ListBodyFieldLabel = styled(FieldLabel)`
  margin-top: 40px;
`;

interface Props {
  heading: string;
  items: JSX.Element[];
  color: string;
  help?: {
    text: string;
    size: number;
    heading: string;
    tagline: string;
    url: string;
  };
}

/**
 * A simple list, that renders a heading, and then lists the items inside a container.
 */
const List: React.FC<Props> = ({ heading, items, color, help }) => {
  const headerStyle = {
    backgroundColor: theme.groupedList[color].headerBackground,
    color: theme.groupedList[color].headerText,
  };
  const bodyStyle = {
    backgroundColor: theme.groupedList[color].bodyBackground,
    color: theme.groupedList[color].bodyText,
  };
  return (
    <ListWrapper style={bodyStyle}>
      <ListHeader style={headerStyle}>
        <HeaderTitleWrapper>
          <HeaderTitle>{heading}</HeaderTitle>
        </HeaderTitleWrapper>
        {help ? <HelpButton {...help} /> : null}
      </ListHeader>
      <ListBody>{items}</ListBody>
    </ListWrapper>
  );
};

List.propTypes = {
  /**
   * The header text of the list.
   */
  heading: PropTypes.string,
  /**
   * The items to display. Each item should have a component, a category and a remove function
   */
  items: PropTypes.array,
  /**
   *  Controls the color scheme of the list
   */
  color: PropTypes.oneOf(Object.keys(theme.groupedList)),
  /**
   * Show an help button
   */
  help: PropTypes.any,
};

List.defaultProps = {
  items: [],
  color: 'light',
};
export default List;
