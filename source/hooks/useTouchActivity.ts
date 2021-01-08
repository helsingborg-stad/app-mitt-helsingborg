import { useState } from 'react';
import { PanResponder } from 'react-native';
import useInterval from './useInterval';

/**
 * @param inactivityTime how long (in ms) the user should be inactive before displaying the inactivity dialog
 * @param intervalDelay with which interval we should check for inactivity, in ms
 * @param initialActive whether to start as active or not
 * @param logoutDelay how long to wait on the dialog before logging the user out
 * @param logOut the callback for handling logging out the user
 */
export default function useTouchActivity(
  inactivityTime: number,
  intervalDelay: number,
  initialActive: boolean,
  logoutDelay: number,
  logOut: () => void
) {
  const [latestTouchTime, setLatestTouchTime] = useState(Date.now());
  const [isActive, setIsActive] = useState(initialActive);

  const handleInterval = () => {
    if (Date.now() - latestTouchTime > inactivityTime && isActive) {
      setIsActive(false);
    }
    if (Date.now() - latestTouchTime > inactivityTime + logoutDelay && !isActive) {
      logOut();
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

  const updateIsActive = (isActive: boolean) => {
    setIsActive(isActive);
  };

  return { panResponder, isActive, updateIsActive, updateLatestTouchTime };
}
