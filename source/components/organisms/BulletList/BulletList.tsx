import React, { useContext } from "react";
import { ThemeContext } from "styled-components/native";

import type {
  ThemeType,
  ComplementaryColor,
} from "../../../theme/themeHelpers";

import {
  Background,
  BulletsContainer,
  BulletContainer,
  BulletText,
  Bullet,
} from "./styled";

const BULLET_ICON = "•";

interface TaskCompletionListProps {
  values: string[];
  colorSchema?: ComplementaryColor;
}
const BulletList = (props: TaskCompletionListProps): JSX.Element => {
  const { values = [], colorSchema = "red" } = props;
  const { colors } = useContext<ThemeType>(ThemeContext);

  const color = colors.complementary[colorSchema][3];
  const bulletColor = colors.primary[colorSchema][1];

  return (
    <Background color={color}>
      {values.map((task, index) => (
        <BulletsContainer
          key={task}
          paddingBottom={index !== values.length - 1 ? "24px" : "0px"}
        >
          <BulletContainer width="10%">
            <Bullet color={bulletColor}>{BULLET_ICON}</Bullet>
          </BulletContainer>
          <BulletContainer width="90%">
            <BulletText>{task}</BulletText>
          </BulletContainer>
        </BulletsContainer>
      ))}
    </Background>
  );
};

export default BulletList;
