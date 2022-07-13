import React, { useContext } from "react";

import { Button, Text, Icon } from "../../components/atoms";
import { Header } from "../../components/molecules";

import AuthContext from "../../store/AuthContext";
import AppContext from "../../store/AppContext";

import {
  ProfileScreenWrapper,
  Container,
  BottomContainer,
  SignOutButton,
  ProfileInfoContainer,
  ProfileInfoHeading,
  ProfileInfoText,
  ProfileLabel,
} from "./ProfileScreen.styled";

import type { Props } from "./ProfileSreen.types";

function ProfileScreen({ navigation }: Props): JSX.Element {
  const { navigate } = navigation;

  const { user, handleLogout } = useContext(AuthContext);
  const { isDevMode } = useContext(AppContext);

  const handleLogoutButtonClick = () => {
    handleLogout();
  };

  const handleNavigateToDevFeatureScreen = () => {
    navigate("DevFeatures");
  };

  const makeField = (fieldLabel: string, fieldValue?: string) => ({
    fieldLabel,
    fieldValue,
  });

  const personalInfoFields = [
    {
      header: "Personuppgifter",
      fields: [
        makeField("NAMN", `${user?.firstName || ""} ${user?.lastName || ""}`),
        makeField("PERSONNUMMER", user?.personalNumber),
      ],
    },
    {
      header: "Adress",
      fields: [
        makeField("GATUADRESS", user?.address?.street),
        makeField("POSTNUMMER", user?.address?.postalCode),
        makeField("ORT", user?.address?.city),
      ],
    },
  ];

  return (
    <ProfileScreenWrapper>
      <Header title="Min profil" themeColor="purple" />
      <Container>
        {personalInfoFields.map(({ header, fields }) => (
          <ProfileInfoContainer key={header}>
            <ProfileInfoHeading type="h5">{header}</ProfileInfoHeading>
            {fields.map(({ fieldLabel, fieldValue }) => (
              <React.Fragment key={fieldLabel}>
                <ProfileLabel underline={false}>{fieldLabel}</ProfileLabel>
                <ProfileInfoText italic={!fieldValue}>
                  {fieldValue ?? "Ej angivet"}
                </ProfileInfoText>
              </React.Fragment>
            ))}
          </ProfileInfoContainer>
        ))}

        <ProfileInfoText italic>
          Dessa uppgifter hämtade vi från Skatteverket när du identifierade dig
          med BankID
        </ProfileInfoText>

        <BottomContainer>
          <SignOutButton
            block
            colorSchema="blue"
            onClick={handleLogoutButtonClick}
          >
            <Text>Logga ut</Text>
          </SignOutButton>

          {isDevMode && (
            <Button
              block
              variant="outlined"
              colorSchema="neutral"
              onClick={handleNavigateToDevFeatureScreen}
            >
              <Text>Utvecklarfunktioner</Text>
              <Icon name="construction" />
            </Button>
          )}
        </BottomContainer>
      </Container>
    </ProfileScreenWrapper>
  );
}

export default ProfileScreen;
