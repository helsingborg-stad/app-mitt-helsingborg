import React from "react";
import { Text, View } from "react-native";
import { storiesOf } from "@storybook/react-native";
import styled from "styled-components/native";
import { ScrollView } from "react-native-gesture-handler";
import StoryWrapper from "../StoryWrapper";
import FloatingButton from "./FloatingButton";

const dummyCallback = () => true;
const buttonIconName = "add";

const Container = styled.View`
  width: 100%;
  height: 100%;
`;
const Scroller = styled.ScrollView`
  padding: 20px;
`;

const TextDisplay = styled.Text`
  font-size: 20px;
`;

const veryLongText = `
The button or buttons should render over the background text, which is scrollable.
When scrolling the text, the button should not move. 
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec cursus sodales odio. Ut aliquam risus at nunc imperdiet, nec ornare purus imperdiet. Donec nunc augue, pellentesque laoreet ultricies et, condimentum at lorem. Ut vehicula leo lobortis diam molestie iaculis. Nunc a metus ac ante condimentum vestibulum eget at sapien. Vestibulum imperdiet urna id lacus sagittis, accumsan rutrum turpis semper. Nulla in ante ipsum.
Fusce vel mi mi. Donec quis velit a urna faucibus bibendum id sit amet odio. Suspendisse aliquet nulla a placerat lobortis. Aliquam pharetra, magna nec condimentum tristique, arcu lectus ultricies erat, sit amet varius turpis leo ac est. Curabitur non elementum magna, ut pharetra dui. Mauris id est hendrerit, maximus sem eget, luctus nunc. Sed et pharetra sapien, a auctor ipsum.
Fusce laoreet ac leo vel tempor. Mauris maximus diam ac congue bibendum. Maecenas ac nulla porta, elementum est sed, dictum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sollicitudin ac ante quis posuere. Praesent accumsan in ex sit amet mattis. Aliquam quis tincidunt nisl. Pellentesque eu nulla dui.
Vivamus tristique, erat non posuere tincidunt, magna dolor auctor est, sit amet posuere tellus dolor molestie ligula. In ut lectus lobortis, pellentesque ipsum ac, blandit elit. Sed feugiat tortor ac erat cursus, in maximus dolor hendrerit. Quisque sed purus ut augue scelerisque rutrum. Aenean ante tortor, mattis eget cursus a, pharetra tincidunt lacus. Sed sit amet nulla eu est pharetra mattis eu nec orci. Etiam ac finibus felis. Curabitur non ullamcorper purus, sit amet venenatis felis.
Mauris turpis nulla, aliquet vitae quam at, euismod luctus lacus. Praesent porttitor enim ac justo pharetra commodo. Ut erat erat, semper ultricies arcu quis, commodo feugiat mi. Proin laoreet orci lorem, ac dignissim libero fringilla nec. In iaculis, lectus quis efficitur faucibus, nulla nulla ultricies elit, at blandit erat lectus et orci. Donec condimentum laoreet diam, id pretium augue ultricies eu. Phasellus tempor, orci ac lobortis facilisis, erat leo lobortis leo, non ultricies turpis nulla in risus. Suspendisse vel porttitor lorem. Quisque pretium, neque at sagittis molestie, libero dui tincidunt justo, ut feugiat tellus elit vel augue. 
`;

storiesOf("FloatingButton", module)
  .add("Icon", () => (
    <StoryWrapper>
      <Container>
        <Scroller>
          <TextDisplay>{veryLongText}</TextDisplay>
        </Scroller>
      </Container>
      <FloatingButton
        onClick={dummyCallback}
        type="icon"
        iconName="add"
        position="right"
      />
      <FloatingButton
        onClick={dummyCallback}
        type="icon"
        iconName="clear"
        position="center"
      />
      <FloatingButton
        onClick={dummyCallback}
        type="icon"
        iconName="refresh"
        position="left"
      />
    </StoryWrapper>
  ))
  .add("Text", () => (
    <StoryWrapper>
      <Container>
        <Scroller>
          <TextDisplay>{veryLongText}</TextDisplay>
        </Scroller>
      </Container>
      <FloatingButton onClick={dummyCallback} type="text" text="Boka möte" />
    </StoryWrapper>
  ));
