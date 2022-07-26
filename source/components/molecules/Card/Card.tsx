import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/native";
import { Button, Text, Heading, Progressbar } from "../../atoms";
import BulletList from "../../organisms/BulletList";
import { colorPalette } from "../../../theme/palette";

const Container = styled.View`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  margin-bottom: 16px;
  padding-left: 1px;
  padding-right: 1px;
`;

const Body = styled.TouchableHighlight`
  background-color: ${(props) =>
    props.colorSchema === "neutral"
      ? props.theme.colors.neutrals[7]
      : props.theme.colors.complementary[props.colorSchema][3]};
  ${(props) => {
    // Overrides colorSchema without affecting it's children
    if (props.color) {
      switch (props.color) {
        case "neutral":
          return `background-color: ${props.theme.colors.neutrals[7]};`;
        default:
          return `background-color: ${
            props.theme.colors.complementary[props.color][3]
          };`;
      }
    }
    return "";
  }}
  padding: 24px;
  border-radius: 8px;
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
  ${(props) => {
    if (props.outlined) {
      switch (props.colorSchema) {
        case "neutral":
          return `border: 2px solid ${props.theme.colors.neutrals[0]};`;
        default:
          return `border: 2px solid ${
            props.theme.colors.primary[props.colorSchema][0]
          };`;
      }
    }
    return "";
  }}
`;

const BodyWrapper = styled.View`
  display: flex;
  flex: 1;
  flex-direction: row;
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

const CardTitle = styled(Heading)`
  color: ${(props) =>
    props.colorSchema === "neutral"
      ? props.theme.colors.neutrals[1]
      : props.theme.colors.primary[props.colorSchema][0]};
  margin-bottom: 0;
`;

const CardSubTitle = styled(Text)`
  color: ${(props) =>
    props.colorSchema === "neutral"
      ? props.theme.colors.neutrals[0]
      : props.theme.colors.primary[props.colorSchema][1]};
  font-size: ${(props) => props.theme.fontSizes[2]}px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  ${(props) => props.mt && `margin-top: ${8 * props.mt}px;`}
`;

const CardText = styled(Text)`
  padding: 0;
  font-size: ${(props) => props.fontSize ?? props.theme.fontSizes[3]}px;
  ${(props) => props.italic && `color: ${props.theme.colors.neutrals[3]};`}
  ${(props) => props.mt && `margin-top: ${8 * props.mt}px;`}
`;
const CardButton = styled(Button)`
  ${(props) => props.mt && `margin-top: ${8 * props.mt}px;`}
  ${(props) => props.mb && `margin-bottom: ${8 * props.mt}px;`}
`;

const Outset = styled.View`
  padding-top: 8px;
  padding-bottom: 8px;
  ${({ firstChild }) => firstChild && "padding-top: 0px;"}
  ${({ lastChild }) => lastChild && "padding-bottom: 0px;"}
`;

const CardImage = styled.Image`
  width: 80px;
  height: 80px;
  resize-mode: contain;
  ${({ circle }) => circle && "border-radius: 50px;"}
`;

const CardProgressbar = styled(Progressbar)`
  height: 7px;
`;

const ProgressBarContainer = styled.View`
  ${(props) => props.mt && `margin-top: ${8 * props.mt}px;`}
`;

/**
 * Card component
 * @param {props} props
 */
const Card = ({ children, colorSchema, ...props }) => {
  // First filter out falsy child components. Then clone each child and add additional props
  const childrenWithProps = React.Children.toArray(children).reduce(
    (filtered, child, index) => {
      if (child) {
        const childWithProps = React.cloneElement(child, {
          key: index,
          colorSchema,
          firstChild: index === 0,
          lastChild: index === React.Children.count(children) - 1,
        });
        filtered.push(childWithProps);
      }
      return filtered;
    },
    []
  );

  return <Container {...props}>{childrenWithProps}</Container>;
};

Card.displayName = "Card";

/**
 * Renders body component and it's children components
 * @param {props} props
 */
Card.Body = ({ children, colorSchema, color, ...props }) => {
  // Remove falsy child components
  const filteredChildren = React.Children.toArray(children).filter(Boolean);

  let underlayColor =
    colorSchema === "neutral"
      ? colorPalette.neutrals[5]
      : colorPalette.complementary[colorSchema][2];
  if (color) {
    underlayColor =
      color === "neutral"
        ? colorPalette.neutrals[5]
        : colorPalette.complementary[color][2];
  }

  const imageWithProps = [];
  const childrenWithProps = [];
  React.Children.map(filteredChildren, (child, index) => {
    // Clone children and separate image from other children to make positioning easier
    if (index === 0 && child.type === Card.Image) {
      imageWithProps[index] = React.cloneElement(child, {
        key: index,
        colorSchema,
        firstChild: index === 0,
        lastChild: index === React.Children.count(filteredChildren) - 1,
      });
      return;
    }

    childrenWithProps[index] = React.cloneElement(child, {
      key: index,
      colorSchema: child.props?.colorSchema || colorSchema,
      color,
      firstChild: index === 0,
      lastChild: index === React.Children.count(filteredChildren) - 1,
    });
  });

  return (
    <Body
      activeOpacity={1}
      underlayColor={underlayColor}
      colorSchema={colorSchema}
      color={color}
      {...props}
    >
      <BodyWrapper>
        {imageWithProps.length > 0 && (
          <BodyImageContainer>{imageWithProps}</BodyImageContainer>
        )}
        <BodyContainer>{childrenWithProps}</BodyContainer>
      </BodyWrapper>
    </Body>
  );
};

Card.Body.displayName = "Card.Body";

/**
 * Renders a title
 * @param {props} props
 */
Card.Title = ({ children, colorSchema, ...props }) => (
  <CardTitle colorSchema={colorSchema} {...props}>
    {children}
  </CardTitle>
);

Card.Title.displayName = "Card.Title";

/**
 * Renders a card section that wraps a group of components in a row
 * @param {props} props
 */
Card.Section = ({ children, colorSchema, color, ...props }) => {
  // Reset padding for sections
  const style = {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  };
  const sectionElement = React.cloneElement(
    <Card.Body />,
    { colorSchema, color, style, ...props },
    children
  );
  return sectionElement;
};

Card.Section.displayName = "Card.Section";

/**
 * Renders sub title
 * @param {props} props
 */
Card.SubTitle = ({ children, colorSchema, ...props }) => (
  <CardSubTitle colorSchema={colorSchema} {...props}>
    {children}
  </CardSubTitle>
);

Card.SubTitle.displayName = "Card.SubTitle";

/**
 * Renders text
 * @param {props} props
 */
Card.Text = ({ children, ...props }) => (
  <CardText {...props}>{children}</CardText>
);

Card.Text.displayName = "Card.Text";

/**
 * Renders a button
 * @param {props} props
 */
Card.Button = ({
  children,
  colorSchema,
  firstChild,
  lastChild,
  mt,
  ...props
}) => (
  <Outset lastChild={lastChild} firstChild={firstChild}>
    <CardButton
      mt={mt}
      variant="link"
      z={0}
      colorSchema={colorSchema}
      block
      {...props}
    >
      {children}
    </CardButton>
  </Outset>
);

Card.Button.displayName = "Card.Button";

/**
 * Renders an image
 * @param {props} props
 */
Card.Image = ({ firstChild, lastChild, ...props }) => (
  <Outset lastChild={lastChild} firstChild={firstChild}>
    <CardImage {...props} />
  </Outset>
);

Card.Image.displayName = "Card.Image";

/**
 * Renders a progress bar
 * @param {props} props
 */
Card.Progressbar = ({
  firstChild,
  lastChild,
  colorSchema,
  mt = 0,
  ...props
}) => (
  <ProgressBarContainer mt={mt}>
    <Outset lastChild={lastChild} firstChild={firstChild}>
      <CardProgressbar rounded colorSchema={colorSchema} {...props} />
    </Outset>
  </ProgressBarContainer>
);

Card.Progressbar.displayName = "Card.Progressbar";

/**
 * Renders a bullet list
 * @param {props} props
 */
Card.BulletList = ({ firstChild, lastChild, values }) => (
  <Outset lastChild={lastChild} firstChild={firstChild}>
    <BulletList values={values} />
  </Outset>
);

Card.BulletList.displayName = "Card.BulletList";

Card.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  colorSchema: PropTypes.oneOf(["neutral", "blue", "red", "purple", "green"]),
};

Card.defaultProps = {
  children: null,
  colorSchema: "neutral",
};

Card.Body.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  colorSchema: PropTypes.oneOf(["neutral", "blue", "red", "purple", "green"]),

  /** Sets a color for the body that does not overrides colorSchema  */
  color: PropTypes.oneOf(["neutral", "blue", "red", "purple", "green"]),
};

Card.Body.defaultProps = {
  children: null,
  colorSchema: "neutral",
  color: "neutral",
};

Card.Title.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  colorSchema: PropTypes.oneOf(["neutral", "blue", "red", "purple", "green"]),
};

Card.Title.defaultProps = {
  children: null,
  colorSchema: "neutral",
};

Card.SubTitle.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  colorSchema: PropTypes.oneOf(["neutral", "blue", "red", "purple", "green"]),
};

Card.SubTitle.defaultProps = {
  children: null,
  colorSchema: "red",
};

Card.Text.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  firstChild: PropTypes.bool,
  lastChild: PropTypes.bool,
  italic: PropTypes.bool,
};

Card.Text.defaultProps = {
  children: null,
  lastChild: false,
  firstChild: false,
  italic: false,
};

Card.Image.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  firstChild: PropTypes.bool,
  lastChild: PropTypes.bool,
  source: PropTypes.number,
  style: PropTypes.element,
  circle: PropTypes.bool,
};

Card.Image.defaultProps = {
  children: null,
  lastChild: false,
  firstChild: false,
  source: "",
  style: null,
  circle: false,
};

Card.Progressbar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  firstChild: PropTypes.bool,
  lastChild: PropTypes.bool,
  colorSchema: PropTypes.oneOf(["neutral", "blue", "red", "purple", "green"]),
};

Card.Progressbar.defaultProps = {
  children: null,
  lastChild: false,
  firstChild: false,
  colorSchema: "red",
};

Card.Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  colorSchema: PropTypes.oneOf(["neutral", "blue", "red", "purple", "green"]),
  firstChild: PropTypes.bool,
  lastChild: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

Card.Button.defaultProps = {
  children: null,
  lastChild: false,
  firstChild: false,
  colorSchema: "neutral",
};

export default Card;
