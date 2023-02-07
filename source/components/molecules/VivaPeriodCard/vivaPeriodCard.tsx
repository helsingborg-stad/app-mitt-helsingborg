/* eslint-disable import/no-unused-modules */
import React, { useContext, useMemo } from "react";
import moment from "moment";

import CaseCard from "../CaseCard";
import ICON from "../../../assets/images/icons";
import { VivaPeriodContext } from "../../../store/VivaPeriodContext";

const noOp = () => undefined;

export function VivaPeriodCard(): JSX.Element | null {
  const { message: vivaPeriodStatusMessage } = useContext(VivaPeriodContext);

  const nextMonthName = useMemo(
    () => moment().add(1, "M").locale("sv").format("MMMM"),
    []
  );

  return vivaPeriodStatusMessage ? (
    <CaseCard
      colorSchema="neutral"
      title="Ekonomiskt Bistånd"
      subtitle={nextMonthName}
      description={vivaPeriodStatusMessage}
      icon={ICON.ICON_EKB_GRAY}
      showDownloadPdfButton={false}
      vivaCaseId=""
      onOpenPdf={noOp}
    />
  ) : null;
}
