import React from "react";
import styled from "styled-components/native";
import {
  Descriptor,
  EventArg,
  TabActions,
  TabNavigationState,
} from "@react-navigation/native";
import { LayoutAnimation } from "react-native";
import PropTypes from "prop-types";
import Text from "../../atoms/Text";
import { PrimaryColor } from "../../../styles/themeHelpers";

const FlexWrapper = styled.TouchableOpacity`
  flex: 1;
`;

const TabBarItem = styled.View`
  padding-top: 16px;
  padding-bottom: 16px;
  flex-direction: column;
  justify-content: flex-start;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  margin-bottom: 5px;
`;

const LabelText = styled(Text)<{ color: PrimaryColor }>`
  color: ${({ theme, color }) => theme.colors.primary[color][0]};
`;

const Underline = styled.View<{ color: PrimaryColor; visible: boolean }>`
  width: 70%;
  margin-left: 15%;
  height: 2px;
  background-color: ${({ theme, color, visible }) =>
    visible ? theme.colors.complementary[color][0] : "transparent"};
  border-radius: 1px;
`;

interface Props {
  route: { key: string; name: string };
  navigation: {
    emit: (obj: any) => EventArg<"tabPress", any, any>;
    dispatch: (obj: any) => void;
  };
  descriptor: Descriptor<
    Record<string, object>,
    string,
    TabNavigationState,
    {
      headerShown?: boolean;
      title?: string;
      tabBarIcon: () => React.ReactNode;
      tabBarIconInactive: () => React.ReactNode;
    },
    {}
  >;
  state: TabNavigationState;
  active?: boolean;
  color: PrimaryColor;
}

const TabNavigatorItem: React.FC<Props> = ({
  color,
  active,
  route,
  navigation,
  descriptor,
  state,
}) => (
  <FlexWrapper
    key={route.key}
    onPress={() => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });
      LayoutAnimation.configureNext({
        duration: 300,
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
        },
      });
      if (!event.defaultPrevented) {
        navigation.dispatch({
          ...TabActions.jumpTo(route.name),
          target: state.key,
        });
      }
    }}
  >
    <TabBarItem>
      <Row>
        {active
          ? descriptor.options.tabBarIcon()
          : descriptor.options.tabBarIconInactive()}
        {active && (
          <LabelText color={color}>
            {descriptor.options.title || route.name}
          </LabelText>
        )}
      </Row>
      <Underline color={color} visible={active} />
    </TabBarItem>
  </FlexWrapper>
);

TabNavigatorItem.propTypes = {
  color: PropTypes.oneOf(["red", "green", "purple", "blue", "neutral"])
    .isRequired,
  active: PropTypes.bool,
  route: PropTypes.shape({
    name: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
  }).isRequired,
  descriptor: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default TabNavigatorItem;
