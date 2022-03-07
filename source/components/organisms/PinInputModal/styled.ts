import styled from "styled-components/native";
import Body from "../../molecules/Dialog/Body";

export const DialogContainer = styled(Body)`
  text-align: center;
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

export const ButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  margin-top: 25px;
  width: 100%;
`;
