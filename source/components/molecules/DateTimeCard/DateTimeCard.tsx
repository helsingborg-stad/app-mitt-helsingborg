import React from "react";
import { Container, TitleText, DateText, TimeText } from "./styled";

interface DateTimeCardProps {
  date?: string;
  time?: string;
}

const DateTimeCard = ({ date, time }: DateTimeCardProps): JSX.Element => (
  <Container>
    <TitleText>TID FÖR MÖTE</TitleText>
    <DateText>{date}</DateText>
    <TimeText>{time}</TimeText>
  </Container>
);

export default DateTimeCard;
