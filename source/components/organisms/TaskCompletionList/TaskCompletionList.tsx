import React, { useContext } from "react";
import { ThemeContext } from "styled-components/native";

import { ThemeType, ComplementaryColor } from "../../../styles/themeHelpers";

import { Checkbox } from "../../atoms";

import {
  Background,
  TaskContainer,
  TaskContainerItem,
  TaskText,
} from "./styled";

type TaskType = {
  text: string;
  checked: boolean;
};

interface TaskCompletionListProps {
  tasks: TaskType[];
  colorSchema?: ComplementaryColor;
}
const TaskCompletionList = (props: TaskCompletionListProps): JSX.Element => {
  const { tasks, colorSchema = "red" } = props;
  const { colors } = useContext<ThemeType>(ThemeContext);

  const color = colors.complementary[colorSchema][3];

  return (
    <Background color={color}>
      {tasks.map((task, index) => (
        <TaskContainer
          key={task.text}
          paddingBottom={index !== tasks.length - 1 ? "24px" : "0px"}
        >
          <TaskContainerItem width="20%">
            <Checkbox
              checked={task.checked}
              onChange={() => true}
              colorSchema={colorSchema}
              disabled
            />
          </TaskContainerItem>
          <TaskContainerItem width="80%">
            <TaskText>{task.text}</TaskText>
          </TaskContainerItem>
        </TaskContainer>
      ))}
    </Background>
  );
};

export default TaskCompletionList;
