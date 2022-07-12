import React from "react";
import { Text, Animated } from "react-native";

interface DotProps {
  index: number;
  currentIndex: Animated.AnimatedDivision;
}

const Dot = ({ index, currentIndex }: DotProps): JSX.Element => {
  const opacity = currentIndex.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [0.5, 1, 0.5],
    extrapolate: "clamp",
  });

  const scale = currentIndex.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [0.5, 1, 0.5],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={{
        opacity,
        backgroundColor: "#2CB9B9",
        width: 8,
        height: 8,
        borderRadius: 4,
        margin: 4,
        transform: [{ scale }],
      }}
    >
      <Text />
    </Animated.View>
  );
};

export default Dot;
