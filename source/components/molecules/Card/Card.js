import React from 'react';
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
`;

function Card({ children, colorSchema, ...props }) {
  console.log('container colorSchema', colorSchema);

  const childrenWithProps = React.Children.map(children, child =>
    React.cloneElement(child, { colorSchema, someProp: 'test' })
  );

  console.log('childrenWithProps', childrenWithProps);

  return <Container {...props}>{childrenWithProps}</Container>;
}

Card.Body = ({ children, colorSchema, ...props }) => {
  const childrenWithProps = React.Children.map(children, child =>
    React.cloneElement(child, { colorSchema, someProp: 'test' })
  );

  return (
    <Body colorSchema={colorSchema} {...props}>
      {childrenWithProps}
    </Body>
  );
};

Card.Title = ({ children, ...props }) => <Heading {...props}>{children}</Heading>;

Card.SubTitle = ({ children, ...props }) => <CardSubTitle {...props}>{children}</CardSubTitle>;

Card.Text = ({ children, ...props }) => (
  <Outset>
    <CardText {...props}>{children}</CardText>
  </Outset>
);

Card.Button = ({ children, colorSchema, someProp, ...props }) => {
  console.log('Props', props);
  console.log('chuld someProp', someProp);
  console.log('button colorSchema', colorSchema);
  return (
    <Outset>
      <Button colorSchema={colorSchema} size="small" block {...props}>
        {children}
      </Button>
    </Outset>
  );
};

export default Card;
