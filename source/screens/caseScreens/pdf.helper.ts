import { Buffer } from "buffer";

import type { PDF } from "../../types/Case";

const BASE64_FILE_PREFIX = "data:application/pdf;base64,";

export function isPdfAvailable(pdf: PDF | undefined): boolean {
  return (pdf?.data?.length ?? 0) > 0;
}

export function pdfToBase64String(pdf: PDF): string {
  return `${BASE64_FILE_PREFIX}${Buffer.from(pdf.data).toString("base64")}`;
}
