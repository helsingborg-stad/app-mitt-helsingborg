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
  elevation: 4;
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

const CardButton = styled(Button)``;

function Card({ children, ...props }) {
  return <Container {...props}>{children}</Container>;
}

Card.Body = ({ children, ...props }) => <Body {...props}>{children}</Body>;

Card.Title = ({ children, ...props }) => <Heading {...props}>{children}</Heading>;

Card.SubTitle = ({ children, ...props }) => <CardSubTitle {...props}>{children}</CardSubTitle>;

Card.Text = ({ children, ...props }) => <CardText {...props}>{children}</CardText>;

Card.Button = ({ children, ...props }) => (
  <CardButton block {...props}>
    {children}
  </CardButton>
);

export default Card;
