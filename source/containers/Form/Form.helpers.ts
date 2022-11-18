import type { File } from "../../components/molecules/FilePicker/FilePicker.types";

interface UploadedFile extends File {
  uploadedId: string;
}

export function answerIsAttachment(answer: unknown): answer is File {
  return (answer as File)?.mime?.length > 0;
}

export function isUploadedAttachment(file: File): file is UploadedFile {
  return !!file.id && !!file.uploadedId;
}

export function getAttachmentAnswers(
  answers: Record<string, unknown | File[]>
): File[] {
  return Object.values(answers)
    .filter(Array.isArray)
    .flat()
    .filter(answerIsAttachment);
}
