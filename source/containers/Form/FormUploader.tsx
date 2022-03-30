import React, { useEffect, useCallback } from "react";
import { ActivityIndicator } from "react-native";
import styled, { withTheme } from "styled-components";
import Config from "react-native-config";
import { Button, Heading, Icon, Text } from "../../components/atoms";
import { Image } from "../../components/molecules/ImageDisplay/ImageDisplay";
import { Pdf } from "../../components/molecules/PdfDisplay/PdfDisplay";
import useQueue, { Options } from "../../hooks/useQueue";
import Dialog from "../../components/molecules/Dialog/Dialog";
import {
  getBlob,
  uploadFile,
  AllowedFileTypes,
} from "../../helpers/FileUpload";

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

function byFileTypes(file: Image | Pdf, fileTypes: AllowedFileTypes[]) {
  return fileTypes.includes(file.fileType);
}

function isArrayCondition(item: unknown): boolean {
  return Array.isArray(item) && item.length > 0;
}

function makeArrayByCondition<TOutType>(
  answers: Record<string, Image[] | Pdf[] | any>,
  fileTypes: AllowedFileTypes[]
): TOutType[] {
  const answerArray = Object.values(answers);
  const answerArrayValues = answerArray.filter(isArrayCondition).flat();

  return answerArrayValues
    .filter((file) => byFileTypes(file, fileTypes))
    .map((arrayItem: TOutType, index: number) => ({
      ...arrayItem,
      index,
    }));
}

export interface Props {
  caseStatus: any;
  answers: Record<string, Image[] | Pdf[] | any>;
  onChange: (value: Record<string, any>, id?: string) => void;
  onResolved?: () => void;
  theme?: any;
}
const FormUploader: React.FunctionComponent<Props> = ({
  answers,
  onChange,
  onResolved,
  theme,
}) => {
  const attachments = makeArrayByCondition<Image>(answers, [
    "jpg",
    "jpeg",
    "png",
  ]);
  const pdfs = makeArrayByCondition<Pdf>(answers, ["pdf"]);

  const upload = async (file: Image | Pdf) => {
    const data: Blob = await getBlob(file.path);
    const filename =
      file.filename ?? ((file.path as string).split("/").pop() as string);
    const uploadResponse = await uploadFile({
      endpoint: "users/me/attachments",
      fileName: filename,
      fileType: file.fileType,
      data,
    });

    if (uploadResponse.error) {
      throw uploadResponse?.message;
    }

    file.uploadedFileName = uploadResponse.uploadedFileName;
    file.url = uploadResponse.url;

    return file;
  };

  const handleUploadFile = useCallback(
    async (file: Image | Pdf) => {
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

  const options: Options<Image> = {
    filters: {
      queue: ({ uploadedFileName }) => !uploadedFileName,
      resolved: ({ uploadedFileName }) => uploadedFileName,
    },
  };

  const [{ resolved, rejected, isPending, count }, { retry }] = useQueue(
    handleUploadFile,
    [...attachments, ...pdfs],
    options
  );

  const handleResolvedImage = () => {
    if (!isPending && resolved.length === count && onResolved) {
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
          <DialogIcon size="48" name="close" />
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
};

FormUploader.defaultProps = {
  answers: {},
};

export default withTheme(FormUploader);
