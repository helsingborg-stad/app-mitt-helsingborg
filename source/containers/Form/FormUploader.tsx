import React, { useEffect, useCallback } from "react";
import { ActivityIndicator } from "react-native";
import styled, { withTheme } from "styled-components";
import Config from "react-native-config";

import useQueue from "../../hooks/useQueue";
import Dialog from "../../components/molecules/Dialog/Dialog";
import { Button, Heading, Icon, Text } from "../../components/atoms";
import { uploadFile } from "../../helpers/FileUpload";
import defaultFileStorageService from "../../services/storage/fileStorage/FileStorageService";

import type { Options } from "../../hooks/useQueue";
import type { ThemeType } from "../../theme/themeHelpers";
import type { File } from "../../components/molecules/FilePicker/FilePicker.types";

interface Props {
  answers: Record<string, File>;
  onChange: (value: Record<string, unknown>, id?: string) => void;
  onResolved?: () => void;
  theme?: ThemeType;
}

const DialogActivityIndicator = styled(ActivityIndicator)`
  margin-bottom: 16px;
  margin-top: 16px;
`;

const DialogButton = styled(Button)`
  margin-top: 16px;
`;

const DialogIcon = styled(Icon)`
  margin-bottom: 16px;
  margin-top: 16px;
  color: ${(props) => props.theme.colors.primary.blue[1]};
`;

function answerIsAttachment(answer: unknown): answer is File {
  return (answer as File)?.mime?.length > 0;
}

function getAttachmentAnswers(answers: Record<string, unknown | File[]>) {
  return Object.values(answers)
    .filter(Array.isArray)
    .flat()
    .filter(answerIsAttachment);
}

function FormUploader({
  answers,
  onChange,
  onResolved,
  theme,
}: Props): JSX.Element {
  const attachments = getAttachmentAnswers(answers);

  const upload = async (file: File) => {
    const data = await defaultFileStorageService.getFileContents(file.id);

    const uploadResponse = await uploadFile({
      endpoint: "users/me/attachments",
      mime: file.mime,
      data,
    });

    if (uploadResponse.error) {
      throw uploadResponse?.message;
    }

    file.uploadedId = uploadResponse.id;

    return file;
  };

  const handleUploadFile = useCallback(
    async (file: File) => {
      try {
        const uploadedFile = await upload(file);
        const updatedQuestion = [...answers[file.questionId]];

        const questionIndex = updatedQuestion.findIndex(
          ({ id }) => id === file.id
        );

        if (questionIndex >= 0) {
          updatedQuestion[questionIndex] = uploadedFile;

          const updateAnswer = {
            [updatedQuestion[0].questionId]: updatedQuestion,
          };

          onChange(updateAnswer, updatedQuestion[0].questionId);
        }

        return uploadedFile;
      } catch (error) {
        if (Config?.APP_ENV === "development")
          console.error("FormUploader: Failed to upload image. Error: ", error);
        file.errorMessage = error;

        // useQueue requires throws to include image as parameter, can probably be improved
        throw file;
      }
    },
    [answers, onChange]
  );

  const options: Options<File> = {
    filters: {
      queue: ({ uploadedId }) => !uploadedId,
      resolved: ({ uploadedId }) => uploadedId,
    },
  };

  const deleteLocalAttachments = () =>
    Promise.all(
      attachments.map(({ id }) => defaultFileStorageService.removeFile(id))
    );

  const [{ resolved, rejected, isPending, count }, { retry }] = useQueue(
    handleUploadFile,
    [...attachments],
    options
  );

  const handleResolvedImage = () => {
    if (!isPending && resolved.length === count && onResolved) {
      void deleteLocalAttachments();
      onResolved();
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handleResolvedImage, [resolved, rejected, isPending, count]);

  return (
    <Dialog visible>
      {isPending && (
        <>
          <DialogActivityIndicator
            size="large"
            color={theme?.colors?.primary?.blue[1] ?? "#003359"}
          />
          <Heading align="center" type="h2">
            Laddar upp filer...
          </Heading>
          <Text align="center">
            ({resolved.length} av {count})
          </Text>
          <Text align="center">Stäng inte av appen eller internet</Text>
        </>
      )}

      {!isPending && rejected.length > 0 && (
        <>
          <DialogIcon size={48} name="close" />
          <Heading align="center" type="h2">
            Någonting gick fel
          </Heading>
          <Text align="center">
            Säkerställ att du har internet uppkoppling och försök igen. Om
            problemet kvarstår, kontakta din handläggare.
          </Text>
          <DialogButton block value="Försök igen" onClick={retry} />
        </>
      )}
    </Dialog>
  );
}

export default withTheme(FormUploader);
