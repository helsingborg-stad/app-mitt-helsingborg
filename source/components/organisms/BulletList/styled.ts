import styled from "styled-components/native";

interface BackgroundProps {
  color: string;
}

const Background = styled.View<BackgroundProps>`
  display: flex;
  flex-direction: column;
  padding: 36px 28px;
  width: 100%;
  background: ${({ color }) => color};
  border-radius: 10px;
`;

interface BulletsContainerProps {
  paddingBottom: string;
}
const BulletsContainer = styled.View<BulletsContainerProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding-bottom: ${({ paddingBottom }) => paddingBottom};
`;

interface BulletContainerProps {
  width: string;
}
const BulletContainer = styled.View<BulletContainerProps>`
  width: ${({ width }) => width};
`;

const BulletText = styled.Text`
  font-weight: 500;
`;

interface BulletProps {
  color: string;
}
const Bullet = styled.Text<BulletProps>`
  font-weight: 500;
  margin: 0;
  color: black;
  font-size: 24px;
  color: ${({ color }) => color};
`;

export { Background, BulletsContainer, BulletContainer, BulletText, Bullet };
