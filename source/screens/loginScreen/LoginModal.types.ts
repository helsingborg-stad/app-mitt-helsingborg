export interface Props {
  visible: boolean;
  isLoading: boolean;
  isIdle: boolean;
  isResolved: boolean;
  isRejected: boolean;
  toggle: () => void;
  handleAuth: (
    personalNumber: string,
    authenticateOnExternalDevice: boolean
  ) => void;
  handleCancelOrder: () => void;
}
