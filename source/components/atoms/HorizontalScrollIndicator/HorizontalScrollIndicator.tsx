import React from 'react';
import styled from 'styled-components/native';

function* range(start:number, end: number) {
  for (let i = start; i <= end; i++) {
      yield i;
  }
}

const SegmentWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const StartSegment = styled.View<{ selected?: boolean }>`
  height: 3px;
  width: 12px;
  margin-right: 3px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  background-color: ${({ selected, theme }) => (selected ? theme.colors.neutrals[2] : theme.colors.neutrals[4])};
`;
const EndSegment = styled.View<{ selected?: boolean }>`
  height: 3px;
  width: 12px;  
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  background-color: ${({ selected, theme }) => (selected ? theme.colors.neutrals[2] : theme.colors.neutrals[4])};
`;
const MiddleSegment = styled.View<{ selected?: boolean }>`
  height: 3px;
  width: 12px;
  margin-right: 3px;
  background-color: ${({ selected, theme }) => (selected ? theme.colors.neutrals[2] : theme.colors.neutrals[4])};
`;
interface CustomScrollIndicatorProps {
  percentage: number;
  numberOfSegments?: number;
}

const HorizontalScrollIndicator: React.FC<CustomScrollIndicatorProps> = ({
  percentage,
  numberOfSegments = 3,
}) =>{ 
  const selectedSegment = Math.round(numberOfSegments * percentage);
  return (
  <SegmentWrapper>
    <StartSegment selected={selectedSegment === 0}/>
    {numberOfSegments > 2 && [...range(0, numberOfSegments-3)].map((v: number) =>
      <MiddleSegment key={v} selected={selectedSegment === v+1} />)}    
    <EndSegment selected={selectedSegment >= numberOfSegments-1} />
  </SegmentWrapper>
);
};

export default HorizontalScrollIndicator;