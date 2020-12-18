import { useState } from 'react';
import { PanResponder } from 'react-native';
import useInterval from './useInterval';

export default function useTouchActivity(inactivityTime, intervalDelay, initialActive) {
  const [latestTouchTime, setLatestTouchTime] = useState(Date.now());
  const [isActive, setIsActive] = useState(initialActive);

  const handleInterval = () => {
    if (Date.now() - latestTouchTime > inactivityTime && isActive) {
      setIsActive(false);
    }
  };

  useInterval(handleInterval, intervalDelay);

  const onTouch = () => {
    setIsActive(true);
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

  const updateIsActive = (isActive) => {
    setIsActive(isActive);
  };

  return { panResponder, isActive, updateIsActive, updateLatestTouchTime };
}
