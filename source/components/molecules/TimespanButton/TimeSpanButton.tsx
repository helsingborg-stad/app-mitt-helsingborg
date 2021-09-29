import React from "react";

import { colorPalette } from "../../../styles/palette";

import MIcon from "../../atoms/Icon";

import { ButtonContainer, TimeText } from "./styled";

interface Props {
  children: React.ReactNode | React.ReactNodeArray;
  selected: boolean;
  onClick: () => void;
}

const TimeSpanButton = (props: Props): JSX.Element => {
  const { children, selected, onClick } = props;

  return (
    <ButtonContainer
      testID="timeSpanButton"
      onPress={onClick}
      selected={selected}
      underlayColor={colorPalette.neutrals[4]}
      disabled={selected}
    >
      <>
        {selected && (
          <MIcon
            testID="timespanbutton_checkmarkIcon"
            name="done"
            color={colorPalette.neutrals[7]}
            size={16}
          />
        )}
        <TimeText selected={selected}>{children}</TimeText>
      </>
    </ButtonContainer>
  );
};

export default TimeSpanButton;
