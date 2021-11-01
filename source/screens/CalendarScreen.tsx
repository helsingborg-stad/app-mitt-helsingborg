import React, { useState, useRef, useContext } from "react";
import {
  RefreshControl,
  Animated,
  Easing,
  ActivityIndicator,
  Platform,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import {
  Card,
  CaseCard,
  Header,
  ScreenWrapper,
  FloatingButton,
} from "../components/molecules";
import { Heading } from "../components/atoms";
import { mockBookingData, BookingItem } from "../helpers/MockBookingData";
import { ModalScreen } from "./featureModalScreens/types";

const Container = styled.ScrollView`
  flex: 1;
  padding-left: 16px;
  padding-right: 16px;
`;

const ListHeading = styled(Heading)`
  margin-left: 4px;
  margin-top: 24px;
  margin-bottom: 8px;
`;

interface CalendarScreenProps {
  navigation: any;
}

const renderCalendarCardComponent = (
  bookingItem: BookingItem,
  isFirst: boolean
) => {
  const { date, time, title } = bookingItem;

  const dateString = moment(date).locale("se").format("dddd D MMMM");
  const timeString = `${time.start}-${time.end}`;
  const key = `${date}-${timeString}`;

  /**
   * TODO: this callback should do something useful.
   * We can for example pass navigation prop to this function
   * and use it to navigate to a screen showing more details
   * about a booking, or maybe open a modal
   */
  const buttonCallback = () => true;

  if (isFirst) {
    return (
      <CaseCard
        key={key}
        colorSchema="red"
        title={title}
        showBookingDate
        bookingDate={dateString}
        bookingTime={timeString}
        showButton
        buttonText="Boka om eller avboka"
        onButtonClick={buttonCallback}
      />
    );
  }
  return (
    <CaseCard
      key={key}
      colorSchema="red"
      title={title}
      largeSubtitle={dateString}
      subtitle={timeString}
      showButton
      buttonText="Boka om eller avboka"
      onButtonClick={buttonCallback}
    />
  );
};

const renderMonth = (
  monthList: BookingItem[],
  monthName: string,
  monthIndex: number
) => (
  <Animated.View key={monthName}>
    <ListHeading type="h5">{monthName}</ListHeading>
    {monthList.map((bookingItem: BookingItem, bookingIndex: number) =>
      renderCalendarCardComponent(
        bookingItem,
        monthIndex === 0 && bookingIndex === 0
      )
    )}
  </Animated.View>
);

const compareByDate = (a: BookingItem, b: BookingItem) =>
  moment(a.date).valueOf() - moment(b.date).valueOf();

const divideBookingsByMonth = (activeBookings: BookingItem[]) => {
  const bookingsByMonth: Record<string, BookingItem[]> = {};
  activeBookings.forEach((bookingItem: BookingItem) => {
    const bookingMonth: string = moment(bookingItem.date).format("MMMM");
    if (!bookingsByMonth[bookingMonth]) {
      bookingsByMonth[bookingMonth] = [];
    }
    bookingsByMonth[bookingMonth].push(bookingItem);
  });
  return bookingsByMonth;
};

const getBookingData = (): Promise<BookingItem[]> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(mockBookingData), 1000);
  });

const CalendarScreen = ({ navigation }: CalendarScreenProps): JSX.Element => {
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<BookingItem[]>([]);
  const theme = useContext(ThemeContext);
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  // get data on tab load
  useFocusEffect(() => {
    let canceled = false;
    getBookingData()
      .then((bookingData: BookingItem[]) => {
        /**
         * make sure we don't update state if the component is not mounted
         * in order to prevent a memory leak.
         */
        if (!canceled) {
          setData(bookingData);
          setLoading(false);
          Animated.timing(fadeAnimation, {
            toValue: 1,
            easing: Easing.ease,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      })
      .catch((error) => console.log(error));
    return () => {
      canceled = true;
    };
  });

  // TODO: actual logic to check if refresh is required before refreshing
  const onRefresh = () => {
    setRefreshing(true);
    getBookingData()
      .then((bookingItem: BookingItem[]) => {
        setData(bookingItem);
        setRefreshing(false);
        fadeAnimation.setValue(0);
        Animated.timing(fadeAnimation, {
          toValue: 1,
          easing: Easing.ease,
          duration: 200,
          useNativeDriver: true,
        }).start();
      })
      .catch((error) => console.log(error));
  };

  const bookingItem = data;
  bookingItem.sort(compareByDate);
  const bookingsByMonth = divideBookingsByMonth(bookingItem);

  return (
    <ScreenWrapper>
      <FloatingButton
        type="text"
        text="Boka möte"
        onPress={() => {
          navigation.navigate("FeatureModal", {
            startScreen: ModalScreen.ServiceSelections,
          });
        }}
      />
      <Header title="Min kalender" />
      <Container
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading && (
          <ActivityIndicator
            size="large"
            color={
              Platform.OS === "ios" ? undefined : theme.colors.primary.red[0]
            }
            style={{ marginTop: 30 }}
          />
        )}
        {bookingItem.length > 0 && (
          <Animated.View style={{ opacity: fadeAnimation }}>
            {Object.keys(bookingsByMonth).map(
              (month: string, monthIndex: number) =>
                renderMonth(bookingsByMonth[month], month, monthIndex)
            )}
          </Animated.View>
        )}
        {!isLoading && bookingItem.length === 0 && (
          <Animated.View style={{ opacity: fadeAnimation, marginTop: 10 }}>
            <Card>
              <Card.Body>
                <Card.Text>Du har inga möten.</Card.Text>
              </Card.Body>
            </Card>
          </Animated.View>
        )}
      </Container>
    </ScreenWrapper>
  );
};

export default CalendarScreen;
