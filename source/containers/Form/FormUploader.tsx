import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import styled, { withTheme } from 'styled-components';
import Config from 'react-native-config';
import { Button, Heading, Icon, Text } from '../../components/atoms';
import { Image } from '../../components/molecules/ImageDisplay/ImageDisplay';
import { uploadImage } from '../../components/molecules/ImageUploader/ImageUploader';
import useQueue, { Options } from '../../hooks/useQueue';
import Dialog from '../../components/molecules/Dialog/Dialog';

export interface Props {
  caseStatus: any;
  answers: Record<string, Image | any>;
  allQuestions: Record<string, any>;
  onChange: (value: Record<string, any>, id?: string) => void;
  onResolved?: () => void;
  theme?: any;
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

const FormUploader: React.FunctionComponent<Props> = ({
  answers,
  allQuestions,
  onChange,
  onResolved,
  theme,
}) => {
  const attachments: Image[] = Object.values(answers)
    .filter((item) => Array.isArray(item) && item.length > 0 && item[0]?.path)
    .map((attachmentsArr) =>
      attachmentsArr.map((attachmentAnswer, index) => ({ ...attachmentAnswer, index }))
    )
    .flat();

  const handleUpload = async (image: Image) => {
    try {
      const uploadedImage = await uploadImage(image);
      const updatedQuestion: Image[] = [...answers[image.questionId]];
      updatedQuestion[image.index] = uploadedImage;

      const updateAnswer: Record<string, any> = {
        [updatedQuestion[0].questionId]: updatedQuestion,
      };

      onChange(updateAnswer, updatedQuestion[0].questionId);

      return uploadedImage;
    } catch (e) {
      if (Config?.APP_ENV === 'development')
        console.error('FormUploader: Failed to upload image. Error: ', e);
      image.errorMessage = e;

      // useQueue requires throws to include image as parameter, can probably be improved
      throw image;
    }
  };

  const options: Options<Image> = {
    filters: {
      queue: ({ uploadedFileName }) => !uploadedFileName,
      resolved: ({ uploadedFileName }) => uploadedFileName,
    },
  };

  const [{ resolved, rejected, isPending, count }, { retry }] = useQueue(
    handleUpload,
    attachments,
    options
  );

  const handleResolved = () => {
    if (!isPending && resolved.length === count && onResolved) {
      onResolved();
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handleResolved, [resolved, rejected, isPending, count]);

  return (
    <Dialog visible>
      {isPending && (
        <>
          <DialogActivityIndicator
            size="large"
            color={theme?.colors?.primary?.blue[1] ?? '#003359'}
          />
          <Heading align="center" type="h2">
            Laddar upp filer
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
            Säkerställ att du har internet uppkoppling och försök igen. Om problemet kvarstår,
            kontakta din handläggare.
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
