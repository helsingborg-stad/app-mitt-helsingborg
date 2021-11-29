import React from "react";
import { Container, TitleText, DateText, TimeText } from "./styled";

interface DateTimeCardProps {
  date?: string;
  time?: string;
  size: "large" | "small";
}

const DateTimeCard = ({ date, time, size }: DateTimeCardProps): JSX.Element => (
  <Container align={size === "large" ? "center" : "flex-start"}>
    <TitleText size={size}>TID FÖR MÖTE</TitleText>
    <DateText size={size}>{date}</DateText>
    <TimeText size={size}>{time}</TimeText>
  </Container>
);

export default DateTimeCard;
