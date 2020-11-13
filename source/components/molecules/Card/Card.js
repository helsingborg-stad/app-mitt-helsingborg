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
  padding: 20px;
  background-color: ${props => props.theme.colors.neutrals[7]};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  elevation: 2;
  shadow-offset: 0px 2px;
  shadow-color: ${props => props.theme.colors.neutrals[4]};
  shadow-opacity: 0.5;
  shadow-radius: 2;
`;

const CardHeading = styled(Heading)`
`;

const CardSubTitle = styled(Text)`
  font-size: ${props => props.theme.fontSizes[2]};
  font-weight: ${props => props.theme.fontWeights[1]};
`;

const CardText = styled(Text)`
  font-size: ${props => props.theme.fontSizes[3]};
  ${props => props.italic && `color: ${props.theme.colors.neutrals[3]};`}
`;

const Outset = styled.View`
  padding-top: 6px;
  padding-bottom: 6px;
  ${props => props.lastChild && `padding-bottom: 0px;`}
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

Card.Body = ({ children, colorSchema, ...props }) => {
  const childrenWithProps = React.Children.map(children, (child, index) =>
    React.cloneElement(child, {
      colorSchema,
      firstChild: index === 0,
      lastChild: index === children.length - 1,
    })
  );

  return (
    <Body colorSchema={colorSchema} {...props}>
      {childrenWithProps}
    </Body>
  );
};

Card.Title = ({ children, colorSchema, ...props }) => (
  <CardHeading colorSchema={colorSchema} {...props}>
    {children}
  </CardHeading>
);

Card.SubTitle = ({ children, ...props }) => <CardSubTitle {...props}>{children}</CardSubTitle>;

Card.Text = ({ children, lastChild, ...props }) => (
  <Outset lastChild>
    <CardText {...props}>{children}</CardText>
  </Outset>
);

Card.Button = ({ children, colorSchema, lastChild, ...props }) => {
  console.log('colorSchema', colorSchema);
  console.log('lastChild', lastChild);
  return (
    <Outset lastChild>
      <Button colorSchema={colorSchema} size="small" block {...props}>
        {children}
      </Button>
    </Outset>
  );
};

Card.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  colorSchema: PropTypes.oneOf('blue', 'red', 'purple', 'green'),
};

Card.defaultProps = {
  colorSchema: 'purple',
};

Card.Body.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  colorSchema: PropTypes.oneOf('blue', 'red', 'purple', 'green'),
};

Card.Title.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

Card.SubTitle.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

Card.Text.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

Card.Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  colorSchema: PropTypes.oneOf('blue', 'red', 'purple', 'green'),
};

export default Card;
