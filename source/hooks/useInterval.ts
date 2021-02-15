import { useEffect, useRef } from 'react';
import BackgroundTimer from 'react-native-background-timer';

export default function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // only one background timer can run at a time, so we stop here to make sure that we don't have unintended collisions
    BackgroundTimer.stopBackgroundTimer();
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      BackgroundTimer.runBackgroundTimer(tick, delay);
    }
  }, [delay]);
}
