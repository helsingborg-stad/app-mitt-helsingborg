import { useState, useEffect, useRef } from 'react';
import { PanResponder } from 'react-native';
import { useTimeout, defaultTimeoutHandler } from './useTimeout';

export interface UseTouchActivityProps {
  onTouchActivity: (time: number, active: boolean) => void;
  isActive?: boolean;
  inactivityTimeoutTime: number;
}


function useTouchActivityTimer({isActive, onTouchActivity, inactivityTimeoutTime}: UseTouchActivityProps) {

  const initialActive = isActive === undefined ? true : isActive;
  const [active, setActive] = useState(initialActive);

  useEffect(() => {
    if (isActive) {
      resetTimerDueToActivity();
    }
  }, [isActive]);

  const [date, setDate] = useState(Date.now());

  /**
   * The timeout is reset when either `date` or `inactivityTimeoutTime` change.
   */
  const cancelTimer = useTimeout(() => {
    setActive(false);
    onTouchActivity(date, false);
  }, inactivityTimeoutTime, defaultTimeoutHandler, [date, inactivityTimeoutTime])

  const isFirstRender = useRef(true);

  /**
   * Triggers `onTouchActivity` each time the `active` state changes
   * after the initial render.
   */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      onTouchActivity(date, active)
    }
  }, [date, active]);

  /**
   * This method is called whenever a touch is detected. If no touch is
   * detected after `this.props.inactivityTimeoutTime` milliseconds, then
   * `active` turns to false.
   */
  function resetTimerDueToActivity() {
    cancelTimer();
    setActive(true);

    /**
     * Causes useTimeout to restart
     */
    setDate(Date.now())
  }

  /**
   * In order not to steal any touches from the children components, this method
   * must return false.
   */
  function resetTimerForPanResponder() {
    resetTimerDueToActivity()
    return false;
  }

  const [panResponder] = useState(PanResponder.create({
      onMoveShouldSetPanResponderCapture: resetTimerForPanResponder,
      onPanResponderTerminationRequest: resetTimerForPanResponder,
      onStartShouldSetPanResponderCapture: resetTimerForPanResponder,
  }),)

  return {panResponder}
}

export default useTouchActivityTimer;
