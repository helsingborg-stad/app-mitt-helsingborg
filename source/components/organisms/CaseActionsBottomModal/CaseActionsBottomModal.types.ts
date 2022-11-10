export interface Props {
  isVisible: boolean;
  isDownloadPdfDisabled: boolean;
  isRemoveCaseDisabled: boolean;
  onCloseModal: () => void;
  onDownloadPdf: () => void;
  onRemoveCase: () => void;
}
