import React, { useState, useRef, useContext, useEffect } from "react";
import {
  RefreshControl,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import moment from "moment";
import svLocale from "moment/locale/sv";
import AuthContext from "../../../store/AuthContext";
import { BookingItem } from "../../../types/BookingTypes";
import { getReferenceCodeForUser } from "../../../helpers/BookingHelper";
import { searchBookings } from "../../../services/BookingService";
import {
  Card,
  CaseCard,
  Header,
  ScreenWrapper,
  FloatingButton,
} from "../../../components/molecules";
import { ModalScreen } from "../../featureModalScreens/types";
import {
  Container,
  ListHeading,
  ScrollViewSpacer,
  SmallCard,
  SmallDate,
  CardContainer,
  DateText,
} from "./styled";

moment.updateLocale("sv", svLocale);

interface CalendarScreenProps {
  navigation: any;
}

const compareByDate = (a: BookingItem, b: BookingItem) =>
  moment(a.date).valueOf() - moment(b.date).valueOf();

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const divideBookingsByMonth = (activeBookings: BookingItem[]) => {
  const bookingsByMonth: Record<string, BookingItem[]> = {};
  activeBookings.forEach((bookingItem: BookingItem) => {
    const bookingMonth: string = capitalize(
      moment(bookingItem.date).format("MMMM")
    );
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
  const [error, setError] = useState<string | undefined>(undefined);
  const [data, setData] = useState<BookingItem[]>([]);
  const { user } = useContext(AuthContext);
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const navigateToSummary = (bookingItem: BookingItem) => {
    navigation.navigate("BookingSummary", { bookingItem });
  };

  const renderCalendarCardComponent = (
    bookingItem: BookingItem,
    isFirst: boolean
  ) => {
    const { date, time, title, id } = bookingItem;

    const dateString = capitalize(moment(date).format("dddd D MMMM"));
    const day = moment(date).format("D");
    const month = moment(date).format("MMM");
    const timeString = `${time.startTime}-${time.endTime}`;
    const key = `${date}-${timeString}-${id}`;

    const buttonCallback = () => {
      navigation.navigate("FeatureModal", {
        startScreen: ModalScreen.RescheduleForm,
        startParams: { bookingItem },
      });
    };

    const card = (
      <CaseCard
        key={isFirst ? key : undefined}
        colorSchema="red"
        title={title}
        showBookingDate
        bookingDate={dateString}
        bookingTime={timeString}
        showButton
        buttonText="Boka om eller avboka"
        onCardClick={() => navigateToSummary(bookingItem)}
        onButtonClick={buttonCallback}
        dateTimeCardSize={isFirst ? "large" : "small"}
      />
    );

    if (isFirst) {
      return card;
    }
    return (
      <SmallCard key={key}>
        <SmallDate>
          <DateText type="text" colorSchema="red" strong align="center">
            {day}
          </DateText>
          <DateText type="text" colorSchema="red" strong align="center">
            {month}
          </DateText>
        </SmallDate>
        <CardContainer>{card}</CardContainer>
      </SmallCard>
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
          setError(undefined);
          setLoading(false);
          Animated.timing(fadeAnimation, {
            toValue: 1,
            easing: Easing.ease,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      } catch (err) {
        console.log(err);
        setData([]);
        setError("Ett fel har inträffat, vänligen försök igen.");
        setLoading(false);
        Animated.timing(fadeAnimation, {
          toValue: 1,
          easing: Easing.ease,
          duration: 200,
          useNativeDriver: true,
        }).start();
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
        setError(undefined);
        setRefreshing(false);
        Animated.timing(fadeAnimation, {
          toValue: 1,
          easing: Easing.ease,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } catch (err) {
        console.log(err);
        setData([]);
        setError("Ett fel har inträffat, vänligen försök igen.");
        setRefreshing(false);
        Animated.timing(fadeAnimation, {
          toValue: 1,
          easing: Easing.ease,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    };

    setLoading(false);
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
            color="slategray"
            style={{ marginTop: 30 }}
          />
        )}
        {!isLoading && error && (
          <Animated.View style={{ opacity: fadeAnimation, marginTop: 10 }}>
            <Card>
              <Card.Body>
                <Card.Text>{error}</Card.Text>
              </Card.Body>
            </Card>
          </Animated.View>
        )}
        {bookingItem.length > 0 && !error && (
          <Animated.View style={{ opacity: fadeAnimation }}>
            {Object.keys(bookingsByMonth).map(
              (month: string, monthIndex: number) =>
                renderMonth(bookingsByMonth[month], month, monthIndex)
            )}
            <ScrollViewSpacer />
          </Animated.View>
        )}
        {!isLoading && bookingItem.length === 0 && !error && (
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
