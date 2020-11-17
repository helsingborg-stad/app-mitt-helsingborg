import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Text, Heading } from 'app/components/atoms';

const Container = styled.View`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  margin-bottom: 16px;
`;

const Body = styled.View`
  background-color: ${props =>
    props.colorSchema === 'neutral'
      ? props.theme.colors.neutrals[7]
      : props.theme.colors.complementary[props.colorSchema][3]};
  ${props => {
    if (props.color) {
      switch (props.color) {
        case 'neutral':
          return `background-color: ${props.theme.colors.neutrals[7]};`;
        default:
          return `background-color: ${props.theme.colors.complementary[props.color][3]};`;
      }
    }
  }}
  padding: 24px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  ${({ shadow }) =>
    shadow &&
    `
  elevation: 2;
  shadow-offset: 0px 2px;
  shadow-color: ${props => props.theme.colors.neutrals[4]};
  shadow-opacity: 0.5;
  shadow-radius: 2px;
  `}
`;

const CardHeading = styled(Heading)`
  color: ${props =>
    props.colorSchema === 'neutral'
      ? props.theme.colors.neutrals[0]
      : props.theme.colors.primary[props.colorSchema][0]};
`;

const CardSubTitle = styled(Text)`
  color: ${props =>
    props.colorSchema === 'neutral'
      ? props.theme.colors.neutrals[0]
      : props.theme.colors.primary[props.colorSchema][3]};
  font-size: ${props => props.theme.fontSizes[2]}px;
  font-weight: ${props => props.theme.fontWeights[1]};
`;

const CardText = styled(Text)`
  font-size: ${props => props.theme.fontSizes[3]}px;
  ${props => props.italic && `color: ${props.theme.colors.neutrals[3]};`}
`;

const Outset = styled.View`
  padding-top: 8px;
  padding-bottom: 8px;
  ${({ firstChild }) => firstChild && `padding-top: 0px;`}
  ${({ lastChild }) => lastChild && `padding-bottom: 0px;`}
`;

const CardImage = styled.Image`
  ${({ circle }) => circle && `border-radius: 50px;`}
`;

const Card = ({ children, colorSchema, ...props }) => {
  // Clone child elements and add additional props
  const childrenWithProps = React.Children.map(children, (child, index) =>
    React.cloneElement(child, {
      colorSchema,
      firstChild: index === 0,
      lastChild: index === children.length - 1,
    })
  );

  return <Container {...props}>{childrenWithProps}</Container>;
};

Card.Body = ({ children, colorSchema, color, ...props }) => {
  const childrenWithProps = React.Children.map(children, (child, index) =>
    React.cloneElement(child, {
      colorSchema,
      firstChild: index === 0,
      lastChild: index === children.length - 1,
    })
  );

  return (
    <Body colorSchema={colorSchema} color={color} {...props}>
      {childrenWithProps}
    </Body>
  );
};

Card.Title = ({ children, colorSchema, ...props }) => (
  <CardHeading colorSchema={colorSchema} {...props}>
    {children}
  </CardHeading>
);

Card.SubTitle = ({ children, colorSchema, ...props }) => (
  <CardSubTitle colorSchema={colorSchema} {...props}>
    {children}
  </CardSubTitle>
);

Card.Text = ({ children, lastChild, firstChild, ...props }) => (
  <Outset lastChild={lastChild} firstChild={firstChild}>
    <CardText {...props}>{children}</CardText>
  </Outset>
);

// TODO: Implement new button variant "Link" when its done
Card.Button = ({ children, colorSchema, firstChild, lastChild, ...props }) => {
  const buttonColors = ['blue', 'red', 'purple', 'green'];
  const color = buttonColors.includes(colorSchema) ? colorSchema : buttonColors[0];
  return (
    <Outset lastChild={lastChild} firstChild={firstChild}>
      <Button variant="outlined" colorSchema={color} size="small" block {...props}>
        {children}
      </Button>
    </Outset>
  );
};

Card.Image = ({ children, firstChild, lastChild, ...props }) => (
  <Outset lastChild={lastChild} firstChild={firstChild}>
    <CardImage {...props} />
  </Outset>
);

Card.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  colorSchema: PropTypes.oneOf(['neutral', 'blue', 'red', 'purple', 'green']),
};

Card.defaultProps = {
  colorSchema: 'neutral',
};

Card.Body.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  colorSchema: PropTypes.oneOf(['neutral', 'blue', 'red', 'purple', 'green']),
  color: PropTypes.oneOf(['neutral', 'blue', 'red', 'purple', 'green']),
};

Card.Title.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  colorSchema: PropTypes.oneOf(['neutral', 'blue', 'red', 'purple', 'green']),
};

Card.SubTitle.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  colorSchema: PropTypes.oneOf(['neutral', 'blue', 'red', 'purple', 'green']),
};

Card.Text.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

Card.Image.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

Card.Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  colorSchema: PropTypes.oneOf(['blue', 'red', 'purple', 'green']),
};

export default Card;
