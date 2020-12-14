import {useEffect, useRef} from 'react';

export interface TimeoutHandler<T> {
  setTimeout: (fn: () => void, timeout: number) => T;
  clearTimeout: (timeout: T | undefined) => void;
}

export const defaultTimeoutHandler: TimeoutHandler<number> = {
  setTimeout: (fn: () => void, timeout: number) => window.setTimeout(fn, timeout),
  clearTimeout: (timeout: number | undefined) => { window.clearTimeout(timeout) },
};

export type CancelTimer = () => void;

export type UseTimeout = <T>(callback: () => void, timeout: number, timeoutHandler: TimeoutHandler<T>, deps?: unknown[]) => CancelTimer;

export function useTimeout<UseTimeout>(callback, timeout, timeoutHandler, deps = []) {
  const refCallback = useRef<() => void>();
  const refTimer = useRef<(typeof timeoutHandler extends TimeoutHandler<infer R> ? R : never)| undefined>()

  useEffect(() => {
    refCallback.current = callback;
  }, callback)

  useEffect(() => {
    const timerID = timeoutHandler.setTimeout(refCallback.current!, timeout);
    refTimer.current = timerID;

    // clean up the timer identified by timerID when the effect is unmounted.
    return () => timeoutHandler.clearTimeout(timerID);
  }, deps);

  function cancelTimer() {
    return timeoutHandler.clearTimeout(refTimer.current);
  }

  return cancelTimer;
}
