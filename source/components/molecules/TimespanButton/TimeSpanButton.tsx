import React from "react";

import { colorPalette } from "../../../styles/palette";

import MIcon from "../../atoms/Icon";

import { ButtonContainer, TimeText } from "./styled";

interface Props {
  startTime: string;
  endTime: string;
  selected: boolean;
  onClick: () => void;
}

const TimeSpanButton = (props: Props): JSX.Element => {
  const { startTime, endTime, selected, onClick } = props;

  return (
    <ButtonContainer
      onPress={onClick}
      selected={selected}
      underlayColor={colorPalette.neutrals[4]}
      disabled={selected}
    >
      <>
        {selected && <MIcon name="done" color="white" size={16} />}
        <TimeText selected={selected}>{`${startTime} - ${endTime}`}</TimeText>
      </>
    </ButtonContainer>
  );
};

export default TimeSpanButton;
