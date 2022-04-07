import { storiesOf } from "@storybook/react-native";
import React, { useState } from "react";
import styled from "styled-components/native";
import DocumentPicker, {
  DocumentPickerResponse,
} from "react-native-document-picker";
import PdfView from "react-native-pdf";
import { Button, Text } from "../components/atoms";
import StoryWrapper from "../components/molecules/StoryWrapper";
import { wrappedDefaultStorage } from "../services/StorageService";

const ButtonRow = styled.View`
  display: flex;
  flex-direction: row;
`;

const FlexContainer = styled.ScrollView`
  background-color: #fff;
  flex: 1;
  margin-left: 30px;
`;

const PdfContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PdfEntry = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 10px;
  padding-right: 5px;
  padding-left: 5px;
  background-color: #9f9;
`;

function FilePickerStory(): JSX.Element {
  const [docs, setDocs] = useState<DocumentPickerResponse[]>([]);
  const [latestLoadLog, setLatestLoadLog] = useState("");

  const pickFile = async () => {
    const newDocs = await DocumentPicker.pickMultiple({
      type: DocumentPicker.types.pdf,
      allowMultiSelection: true,
      // copyTo: "cachesDirectory",
    });

    console.log("newDocs", newDocs);
    setDocs((old) => [...old, ...newDocs]);
  };

  const pickFileCached = async () => {
    const newDocs = await DocumentPicker.pickMultiple({
      type: DocumentPicker.types.pdf,
      allowMultiSelection: true,
      copyTo: "cachesDirectory",
    });

    console.log("newDocs", newDocs);
    setDocs((old) => [...old, ...newDocs]);
  };

  const tryLoad = async (uri: string) => {
    try {
      setLatestLoadLog("loading...");
      console.log("tryLoad", uri);
      const response = await fetch(uri);
      console.log("fetch response: ", response);
      const blob = await response.blob();
      console.log("blob:", blob);
      setLatestLoadLog(`loaded! ${blob.size} bytes`);
    } catch (error) {
      setLatestLoadLog(`error: ${error}`);
    }
  };

  const saveData = async () => {
    console.log("saving docs", docs.length);
    await wrappedDefaultStorage.saveData(
      "___filePicker_TEST_docs",
      JSON.stringify(docs)
    );
  };

  const loadData = async () => {
    console.log("loading docs");
    const newDocs = await wrappedDefaultStorage.getData(
      "___filePicker_TEST_docs"
    );
    if (newDocs) {
      const finalDocs = JSON.parse(newDocs) ?? [];
      console.log("finalDocs", finalDocs.length);
      setDocs(finalDocs);
    }
  };

  const clearDocs = () => {
    setDocs([]);
  };

  return (
    <FlexContainer>
      <ButtonRow>
        <Button
          onClick={pickFile}
          colorSchema="neutral"
          style={{ marginRight: 5 }}
        >
          <Text>Pick</Text>
        </Button>
        <Button
          onClick={pickFileCached}
          colorSchema="neutral"
          style={{ marginRight: 5 }}
        >
          <Text>Pick Cached</Text>
        </Button>
      </ButtonRow>
      <ButtonRow>
        <Button onClick={loadData} colorSchema="red" style={{ marginRight: 5 }}>
          <Text>Load</Text>
        </Button>
        <Button
          onClick={saveData}
          colorSchema="green"
          style={{ marginRight: 5 }}
        >
          <Text>Save</Text>
        </Button>
        <Button
          onClick={clearDocs}
          colorSchema="purple"
          style={{ marginRight: 5 }}
        >
          <Text>Clear</Text>
        </Button>
      </ButtonRow>
      <Text>{latestLoadLog}</Text>
      <Text>docs: {docs.length}</Text>
      <PdfContainer>
        {docs.map((doc, index) => (
          <PdfEntry key={doc.fileCopyUri ?? doc.uri}>
            <Text style={{ margin: 5, fontSize: 9 }}>
              {index}: {doc.fileCopyUri ?? doc.uri}
            </Text>
            <Button
              colorSchema="blue"
              onClick={() => tryLoad(doc.fileCopyUri ?? doc.uri ?? "")}
            >
              <Text>Try Load</Text>
            </Button>
            <PdfView
              source={{ uri: doc.fileCopyUri }}
              style={{
                flex: 1,
                width: 120,
                height: 170,
                backgroundColor: "red",
              }}
            />
          </PdfEntry>
        ))}
      </PdfContainer>
    </FlexContainer>
  );
}

storiesOf("File Picker", module).add("Overview", () => (
  <StoryWrapper>
    <FilePickerStory />
  </StoryWrapper>
));
