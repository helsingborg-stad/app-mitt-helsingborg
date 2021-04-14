import React, { useEffect } from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import Config from 'react-native-config';
import { Button, Heading, Text } from '../../components/atoms';
import { Image } from '../../components/molecules/ImageDisplay/ImageDisplay';
import { uploadImage } from '../../components/molecules/ImageUploader/ImageUploader';
import useQueue, { Options } from '../../hooks/useQueue';
import { updateAnswer } from './hooks/formActions';

export interface Props {
  caseStatus: any;
  answers: Record<string, Image | any>;
  allQuestions: Record<string, any>;
  onChange: (value: Record<string, any>, id?: string) => void;
  onResolved?: () => void;
}

const Wrapper = styled(View)`
  background-color: #f7a600;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const FormUploader: React.FunctionComponent<Props> = ({
  answers,
  allQuestions,
  onChange,
  onResolved,
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

  useEffect(() => {
    if (!isPending && resolved.length === count) {
      if (onResolved) {
        onResolved();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolved, rejected, isPending, count]);

  return (
    <Wrapper>
      {isPending && (
        <Wrapper>
          <Heading align="center" type="h1">
            Laddar upp information
          </Heading>
          <Text align="center">
            Laddar upp filer ({resolved.length}/{count})
          </Text>
        </Wrapper>
      )}

      {!isPending && rejected.length <= 0 && (
        <Wrapper>
          <Heading align="center" type="h1">
            Success!!!
          </Heading>
        </Wrapper>
      )}

      {!isPending && rejected.length > 0 && (
        <Wrapper>
          <Heading align="center" type="h1">
            rejected to complete upload
          </Heading>
          <Text align="center">
            rejected to upload ({rejected.length}/{count})
          </Text>
          <Button value="Retry" onClick={retry} />
        </Wrapper>
      )}
    </Wrapper>
  );
};

FormUploader.defaultProps = {
  answers: {},
};

export default FormUploader;
