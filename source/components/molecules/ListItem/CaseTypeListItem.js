import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components/native';
import icons from '../../../helpers/Icons';
import Text from '../../atoms/Text';
import Icon from '../../atoms/Icon';
import Button from '../../atoms/Button/Button';

const HighlightedItem = styled(Button)`
  padding: 0px;
  margin-bottom: 12px;
  background-color: white;
`;

const Flex = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  padding-left: 20px;
`;

const Title = styled(Text)`
  color: ${(props) => props.theme.background.darkest};
  margin-bottom: 4px;
  font-size: 25px;
`;

const IconContainer = styled.View`
  width: 64px;
  background: ${(props) => props.background};
  border-top-left-radius: 12.5px;
  border-bottom-left-radius: 12.5px;
  margin-right: 14px;
`;

const IconFlex = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Content = styled.View`
  flex: 1;
  padding: 16px 0px 16px 8px;
`;

const Chevron = styled(Icon)`
  color: #a3a3a3;
  margin-right: 16px;
`;

const ImageIcon = styled.Image`
  width: 64px;
  height: 64px;
`;

const CaseTypeListItem = (props) => {
  const { title, color, onClick, icon, children } = props;

  const background =
    (color && Object.prototype.hasOwnProperty.call(icon, color) && icon[color][1]) || 'transparent';

  return (
    <HighlightedItem onClick={onClick} block>
      <Flex>
        <IconContainer highlighted background={background}>
          <IconFlex>
            <ImageIcon source={icons[icon]} resizeMode="contain" />
          </IconFlex>
        </IconContainer>

        <Content>
          {title && <Title>{title}</Title>}
          {children}
        </Content>
        <Chevron name="chevron-right" />
      </Flex>
    </HighlightedItem>
  );
};

export default withTheme(CaseTypeListItem);

CaseTypeListItem.propTypes = {
  color: PropTypes.oneOf(['blue', 'purple', 'red', 'green']),
  icon: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.any,
};
