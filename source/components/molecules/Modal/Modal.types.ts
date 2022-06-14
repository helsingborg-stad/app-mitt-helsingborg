import { ModalProps } from "react-native";

export interface Props extends ModalProps {
  visible: boolean;
  children: React.ReactNode | React.ReactNode[];
  backgroundBlur?: boolean;
  hide?: () => void;
}
