import { useState } from 'react';
import { PanResponder } from 'react-native';
import useInterval from './useInterval';

export default function useTouchActivity(intervalDelay, touching) {
  const [latestTouchTime, setLatestTouchTime] = useState(Date.now());
  const [isTouching, setIsTouching] = useState(touching);

  const inactivityTime = 15000;

  const intervalInactivityCheck = () => {
    console.log(Date.now() - latestTouchTime);
    if (Date.now() - latestTouchTime > inactivityTime && isTouching) {
      setIsTouching(false);
    }
  };

  useInterval(intervalInactivityCheck, intervalDelay);

  const onTouch = () => {
    setIsTouching(true);
    setLatestTouchTime(Date.now());
    return false;
  };

  const updateLatestTouchTime = () => {
    setLatestTouchTime(Date.now);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: onTouch,
    onPanResponderTerminationRequest: onTouch,
    onStartShouldSetPanResponderCapture: onTouch,
  });

  const updateIsTouching = (isTouching) => {
    setIsTouching(isTouching);
  };

  return { panResponder, isTouching, updateIsTouching, updateLatestTouchTime };
}
