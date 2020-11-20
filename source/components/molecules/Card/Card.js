import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Text, Heading, Progressbar } from 'app/components/atoms';

const Container = styled.View`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  margin-bottom: 16px;
  padding-left: 1px;
  padding-right: 1px;
`;

const Body = styled.View`
  background-color: ${props =>
    props.colorSchema === 'neutral'
      ? props.theme.colors.neutrals[7]
      : props.theme.colors.complementary[props.colorSchema][3]};
  ${props => {
    // Overrides colorSchema without affecting it's children
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
  flex-direction: row;
  ${({ shadow }) =>
    shadow &&
    `
  elevation: 2;
  shadow-offset: 0px 2px;
  shadow-color: black;
  shadow-opacity: 0.3;
  shadow-radius: 2px;
  `}
  ${props => {
    if (props.outlined) {
      switch (props.colorSchema) {
        case 'neutral':
          return `border: 2px solid ${props.theme.colors.neutrals[0]};`;
        default:
          return `border: 2px solid ${props.theme.colors.primary[props.colorSchema][0]};`;
      }
    }
  }}
`;

const CardTitle = styled(Heading)`
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

const CardProgressbar = styled(Progressbar)`
  height: 7px;
`;

const BodyImageContainer = styled.View`
  padding-right: 24px;
`;

const BodyContainer = styled.View`
  width: 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

/**
 * Card component
 * @param {props} props
 */
const Card = ({ children, colorSchema, ...props }) => {
  // Clone child elements and add additional props
  const childrenWithProps = React.Children.map(children, (child, index) =>
    React.cloneElement(child, {
      key: index,
      colorSchema,
      firstChild: index === 0,
      lastChild: index === React.Children.count(children) - 1,
    })
  );

  return <Container {...props}>{childrenWithProps}</Container>;
};

/**
 * Renders body component and it's children components
 * @param {props} props
 */
Card.Body = ({ children, colorSchema, color, ...props }) => {
  const imageWithProps = [];
  const childrenWithProps = [];
  React.Children.map(children, (child, index) => {
    // Clone children and separate image from other children to make positioning easier
    if (index === 0 && child.type === Card.Image) {
      imageWithProps[index] = React.cloneElement(child, {
        key: index,
        colorSchema,
        firstChild: index === 0,
        lastChild: index === React.Children.count(children) - 1,
      });
      return;
    }

    childrenWithProps[index] = React.cloneElement(child, {
      key: index,
      colorSchema,
      firstChild: index === 0,
      lastChild: index === React.Children.count(children) - 1,
    });
  });

  return (
    <Body colorSchema={colorSchema} color={color} {...props}>
      {imageWithProps.length > 0 && <BodyImageContainer>{imageWithProps}</BodyImageContainer>}
      <BodyContainer>{childrenWithProps}</BodyContainer>
    </Body>
  );
};

/**
 * Renders a title
 * @param {props} props
 */
Card.Title = ({ children, colorSchema, ...props }) => (
  <CardTitle colorSchema={colorSchema} {...props}>
    {children}
  </CardTitle>
);

/**
 * Renders sub title
 * @param {props} props
 */
Card.SubTitle = ({ children, colorSchema, ...props }) => (
  <CardSubTitle colorSchema={colorSchema} {...props}>
    {children}
  </CardSubTitle>
);

/**
 * Renders text
 * @param {props} props
 */
Card.Text = ({ children, lastChild, firstChild, ...props }) => (
  <Outset lastChild={lastChild} firstChild={firstChild}>
    <CardText {...props}>{children}</CardText>
  </Outset>
);

/**
 * Renders a button
 * @param {props} props
 */
Card.Button = ({ children, colorSchema, firstChild, lastChild, ...props }) => {
  const buttonColors = ['blue', 'red', 'purple', 'green'];
  const color = buttonColors.includes(colorSchema) ? colorSchema : buttonColors[0];
  return (
    <Outset lastChild={lastChild} firstChild={firstChild}>
      <Button variant="link" z={0} colorSchema={color} block {...props}>
        {children}
      </Button>
    </Outset>
  );
};

/**
 * Renders an image
 * @param {props} props
 */
Card.Image = ({ children, firstChild, lastChild, ...props }) => (
  <Outset lastChild={lastChild} firstChild={firstChild}>
    <CardImage {...props} />
  </Outset>
);

/**
 * Renders a progress bar
 * @param {props} props
 */
Card.Progressbar = ({ children, firstChild, lastChild, colorSchema, ...props }) => (
  <Outset lastChild={lastChild} firstChild={firstChild}>
    <CardProgressbar rounded colorSchema={colorSchema} {...props} />
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
  firstChild: PropTypes.bool,
  lastChild: PropTypes.bool,
};

Card.Image.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  firstChild: PropTypes.bool,
  lastChild: PropTypes.bool,
};

Card.Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  colorSchema: PropTypes.oneOf(['neutral', 'blue', 'red', 'purple', 'green']),
  firstChild: PropTypes.bool,
  lastChild: PropTypes.bool,
};

export default Card;
