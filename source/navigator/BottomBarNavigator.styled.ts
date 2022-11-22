import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

const TabBarImage = styled.Image`
  width: 25px;
  height: 25px;
`;

const SafeAreaViewContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props) => props.theme.colors.neutrals[5]};
`;

export { TabBarImage, SafeAreaViewContainer };
