import styled from "styled-components/native";

interface BackgroundProps {
  color: string;
}

const Background = styled.View<BackgroundProps>`
  display: flex;
  flex-direction: column;
  padding: 36px 28px;
  width: 100%;
  background: ${({ color }) => color};
  border-radius: 10px;
`;

interface TaskContainerProps {
  paddingBottom: string;
}
const TaskContainer = styled.View<TaskContainerProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding-bottom: ${({ paddingBottom }) => paddingBottom};
`;

interface TaskContainerItemProps {
  width: string;
}
const TaskContainerItem = styled.View<TaskContainerItemProps>`
  width: ${({ width }) => width};
`;

const TaskText = styled.Text`
  font-weight: 500;
`;

export { Background, TaskContainer, TaskContainerItem, TaskText };
