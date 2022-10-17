import React from "react";

import {
  SegmentWrapper,
  StartSegment,
  EndSegment,
  MiddleSegment,
} from "./HorizontalScrollIndicator.styled";

import type { Props } from "./HorizontalScrollIndicator.styled.types";

function* range(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

const HorizontalScrollIndicator: React.FC<Props> = ({
  percentage,
  numberOfSegments = 3,
}) => {
  const selectedSegment = Math.round(numberOfSegments * percentage);
  return (
    <SegmentWrapper>
      <StartSegment selected={selectedSegment === 0} />
      {numberOfSegments > 2 &&
        [...range(0, numberOfSegments - 3)].map((v: number) => (
          <MiddleSegment key={v} selected={selectedSegment === v + 1} />
        ))}
      <EndSegment selected={selectedSegment >= numberOfSegments - 1} />
    </SegmentWrapper>
  );
};

export default HorizontalScrollIndicator;
