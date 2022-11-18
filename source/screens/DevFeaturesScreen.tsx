import PropTypes from "prop-types";
import React, { useContext } from "react";
import styled from "styled-components/native";
import env from "react-native-config";

import { CaseDispatch } from "../store/CaseContext";
import AuthContext from "../store/AuthContext";

import FormList from "../components/organisms/FormList/FormList";
import { Button, Text } from "../components/atoms";
import Header from "../components/molecules/Header";
import ScreenWrapper from "../components/molecules/ScreenWrapper";

import StorageService from "../services/storage/StorageService";

import useSetupForm from "./caseScreens/useSetupForm";

import type { Answer } from "../types/Case";
import defaultFileStorageService from "../services/storage/fileStorage/FileStorageService";
import { splitFilePath } from "../helpers/FileUpload";

const Container = styled.ScrollView`
  flex: 1;
  padding-left: 16px;
  padding-right: 16px;
`;

const FieldWrapper = styled.View`
  margin-top: 8px;
  margin-bottom: 8px;
`;

const DeveloperScreen = (props: any): JSX.Element => {
  const { navigation } = props;
  const { createCase } = useContext(CaseDispatch);
  const authContext = useContext(AuthContext);

  const [setupForm] = useSetupForm();

  const colorSchema = "neutral";

  const deleteLocalFiles = async () => {
    const files = await defaultFileStorageService.getFileList();
    const fileIds = files.map((file) => splitFilePath(file).name);
    return Promise.all(
      fileIds.map((id) => defaultFileStorageService.removeFile(id))
    );
  };

  return (
    <ScreenWrapper>
      <Header title="Utvecklarfunktioner" />

      <Container>
        <FormList
          heading="Ansökningsformulär"
          onClickCallback={async (form) => {
            if (createCase && form) {
              createCase(form, async ({ id, forms, currentFormId }) => {
                await setupForm(
                  forms[currentFormId].answers as Answer[],
                  form.id as string
                );
                navigation.navigate("Form", { caseId: id });
              });
            }
          }}
        />

        <FieldWrapper>
          <Button
            block
            variant="outlined"
            colorSchema={colorSchema}
            onClick={async () => {
              void StorageService.clearData();
              void deleteLocalFiles();
              await authContext.handleLogout();
            }}
          >
            <Text>Nollställ appdata</Text>
          </Button>
        </FieldWrapper>

        <FieldWrapper>
          <Button
            block
            variant="contained"
            colorSchema={colorSchema}
            onClick={async () => {
              navigation.navigate("App");
            }}
          >
            <Text>Tillbaka</Text>
          </Button>
        </FieldWrapper>

        <FieldWrapper>
          {Object.keys(env)
            .filter((key) => typeof env[key] !== typeof Object)
            .map((key) => (
              <FieldWrapper key={key}>
                <Text>
                  {key} ({typeof env[key]})
                </Text>
                <Text>{JSON.stringify(env[key])}</Text>
              </FieldWrapper>
            ))}
        </FieldWrapper>
      </Container>
    </ScreenWrapper>
  );
};

DeveloperScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default DeveloperScreen;
