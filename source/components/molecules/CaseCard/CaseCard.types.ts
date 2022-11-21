import type { ImageSourcePropType } from "react-native";

export interface Props {
  title: string;
  subtitle?: string;
  largeSubtitle?: string;
  description?: string;
  icon?: ImageSourcePropType;
  colorSchema?: string;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
  showButton?: boolean;
  showAppealButton?: boolean;
  buttonText?: string;
  buttonIconName?: string;
  showPayments?: boolean;
  approvedAmount?: string | number;
  declinedAmount?: string | number;
  givedate?: string;
  buttonColorScheme?: string;
  completions?: string[];
  completionsClarification?: string;
  pin?: string;
  showDownloadPdfButton: boolean;
  onCardClick?: () => void;
  onButtonClick?: () => void;
  onAppealButtonClick?: () => void;
  onOpenPdf: () => void;
}
