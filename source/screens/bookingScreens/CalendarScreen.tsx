import React, { useState, useRef, useContext, useEffect } from "react";
import {
  RefreshControl,
  Animated,
  Easing,
  ActivityIndicator,
  Platform,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import moment from "moment";
import svLocale from "moment/locale/sv";
import AuthContext from "../../store/AuthContext";
import { BookingItem } from "../../types/BookingTypes";
import { getReferenceCodeForUser } from "../../helpers/BookingHelper";
import { searchBookings } from "../../services/BookingService";
import {
  Card,
  CaseCard,
  Header,
  ScreenWrapper,
  FloatingButton,
} from "../../components/molecules";
import { Heading } from "../../components/atoms";
import { ModalScreen } from "../featureModalScreens/types";

moment.updateLocale("sv", svLocale);

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

const ScrollViewSpacer = styled.View`
  height: 60px;
`;

interface CalendarScreenProps {
  navigation: any;
}

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

const CalendarScreen = ({ navigation }: CalendarScreenProps): JSX.Element => {
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<BookingItem[]>([]);
  const theme = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const navigateToSummary = (bookingItem: BookingItem) => {
    navigation.navigate("BookingSummary", { bookingItem });
  };

  const renderCalendarCardComponent = (
    bookingItem: BookingItem,
    isFirst: boolean
  ) => {
    const { date, time, title } = bookingItem;

    const dateString = moment(date).format("dddd D MMMM");
    const timeString = `${time.startTime}-${time.endTime}`;
    const key = `${date}-${timeString}`;

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
          onCardClick={() => navigateToSummary(bookingItem)}
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
        onCardClick={() => navigateToSummary(bookingItem)}
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

  useEffect(() => {
    let canceled = false;
    const refCode = getReferenceCodeForUser(user);
    const startTime = moment().startOf("day").format();
    const endTime = moment().add(6, "months").format();
    const fetchData = async () => {
      try {
        const bookingData: BookingItem[] = (await searchBookings(
          refCode,
          startTime,
          endTime
        )) as BookingItem[];
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
      } catch (error) {
        console.log(error);
      }
    };

    void fetchData();
    return () => {
      canceled = true;
    };
  }, [user, fadeAnimation]);

  const onRefresh = () => {
    const refCode = getReferenceCodeForUser(user);
    const startTime = moment().startOf("day").format();
    const endTime = moment().add(6, "months").format();
    const fetchData = async () => {
      try {
        const bookingData: BookingItem[] = (await searchBookings(
          refCode,
          startTime,
          endTime
        )) as BookingItem[];
        setData(bookingData);
        setRefreshing(false);
        Animated.timing(fadeAnimation, {
          toValue: 1,
          easing: Easing.ease,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.log(error);
      }
    };

    setRefreshing(true);
    void fetchData();
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
            <ScrollViewSpacer />
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
