import { useState } from 'react';
import { PanResponder } from 'react-native';
import useInterval from './useInterval';

export type UseTouchParameters = {
  inactivityTime: number;
  intervalDelay: number;
  logoutDelay: number;
  logOut: () => void;
  refreshInterval?: number;
  refreshSession?: () => void;
};

/**
 * @param inactivityTime how long (in ms) the user should be inactive before displaying the inactivity dialog
 * @param intervalDelay with which interval we should check for inactivity, in ms
 * @param logoutDelay how long to wait on the dialog before logging the user out
 * @param logOut the callback for handling logging out the user
 */
export default function useTouchActivity({
  inactivityTime,
  intervalDelay,
  logoutDelay,
  logOut,
  refreshInterval,
  refreshSession,
}: UseTouchParameters) {
  const [latestTouchTime, setLatestTouchTime] = useState(Date.now());
  const [latestRefreshTime, setLatestRefreshTime] = useState(Date.now());
  const [isActive, setIsActive] = useState(true);

  const handleInterval = () => {
    const now = Date.now();
    if (now - latestTouchTime > inactivityTime && isActive) {
      setIsActive(false);
    } else if (isActive && refreshSession && now - latestRefreshTime > refreshInterval) {
      refreshSession();
      setLatestRefreshTime(now);
    }
    if (now - latestTouchTime > inactivityTime + logoutDelay && !isActive) {
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
    setLatestTouchTime(Date.now());
  };
  const updateLatestRefreshTime = () => {
    setLatestRefreshTime(Date.now());
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: onTouch,
    onPanResponderTerminationRequest: onTouch,
    onStartShouldSetPanResponderCapture: onTouch,
  });

  const updateIsActive = (isActive: boolean) => {
    setIsActive(isActive);
  };

  return { panResponder, isActive, updateIsActive, updateLatestTouchTime, updateLatestRefreshTime };
}
