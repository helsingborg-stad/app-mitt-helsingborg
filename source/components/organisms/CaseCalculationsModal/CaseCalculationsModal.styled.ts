import styled from "styled-components/native";

import { BackNavigation } from "../../molecules";

import { Text } from "../../atoms";

const CloseModalButton = styled(BackNavigation)`
  padding: 24px 24px 0px 24px;
`;

const ModalContent = styled.View`
  margin: 16px;
  margin-top: 32px;
`;

const SummaryHeading = styled(Text)`
  margin-left: 4px;
  margin-top: 30px;
  margin-bottom: 16px;
`;

const ModalFooter = styled.View`
  margin: 16px;
  margin-bottom: 32px;
  justify-content: center;
  align-items: center;
`;

const CalculationTable = styled.View`
  flex: 1;
  border: 1px solid ${(props) => props.theme.colors.complementary.neutral[1]};
  border-radius: 5px;
  padding-bottom: 8px;
`;

interface CalculationRowProps {
  paddingBottom?: number;
}
const CalculationRow = styled.View<CalculationRowProps>`
  padding-bottom: ${({ paddingBottom }) => `${paddingBottom ?? 0}px`};
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

const CalculationRowHeader = styled(CalculationRow)`
  padding: 4px 0px;
  margin-bottom: 8px;
  border-radius: 5px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  background-color: ${(props) => props.theme.colors.neutrals[5]};
`;

interface CalculationRowCellProps {
  flex?: number;
  justify?: "start" | "flex-end" | "flex-start";
}
const CalculationRowCell = styled.View<CalculationRowCellProps>`
  ${({ justify }) => justify && `justify-content: ${justify}`};
  flex: ${({ flex }) => flex ?? 1};
  align-self: stretch;
  padding-left: 8px;
  padding-right: 8px;
`;

const DetailsTitle = styled(Text)`
  margin-top: 16px;
  margin-bottom: 16px;
`;

export {
  CloseModalButton,
  ModalContent,
  SummaryHeading,
  ModalFooter,
  CalculationTable,
  CalculationRow,
  CalculationRowHeader,
  CalculationRowCell,
  DetailsTitle,
};
