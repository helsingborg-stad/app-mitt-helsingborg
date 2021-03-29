/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { FilterFn } from '../types/ArrayTypes';

export type Options<T> = {
  filters?: {
    queue?: FilterFn<T>;
    resolved?: FilterFn<T>;
    rejected?: FilterFn<T>;
  };
};

export interface State<T> {
  rejected: T[];
  resolved: T[];
  isPending: boolean;
  count: number;
}

export interface Actions {
  retry: () => void;
}

function useQueue<T>(
  callback: (item: T) => Promise<T>,
  items: T[],
  options?: Options<T>
): [State<T>, Actions] {
  const { filters } = options;

  const initialQueue = filters?.queue ? items.filter(filters.queue) : items;
  const initialRejected = filters?.rejected ? items.filter(filters.rejected) : [];
  const initialResolved = filters?.resolved ? items.filter(filters.resolved) : [];

  const [queue, setQueue] = useState(initialQueue);
  const [rejected, setRejected] = useState(initialRejected);
  const [resolved, setResolved] = useState(initialResolved);

  const [isPending, setIsPending] = useState(true);

  const retry = () => {
    const updatedQueue = [...queue, ...rejected];
    setRejected([]);
    setQueue(updatedQueue);
  };

  const onResolved = (resolvedItem) => {
    const updatedResolved = [...resolved];
    updatedResolved.push(resolvedItem);
    setResolved(updatedResolved);
  };

  const onRejected = (rejectedItem) => {
    const updatedRejected = [...rejected];
    updatedRejected.push(rejectedItem);
    setRejected(updatedRejected);
  };

  const setPendingState = () => {
    if (queue && queue.length > 0) {
      if (!isPending) setIsPending(true);
      return;
    }

    if (isPending) setIsPending(false);
  };

  const next = () => {
    if (!queue || queue.length <= 0) return;

    const updatedQueue = [...queue];
    const attachment = updatedQueue.shift();

    callback(attachment)
      .then(onResolved)
      .catch(onRejected)
      .then(() => {
        setQueue(updatedQueue);
      });
  };

  useEffect(setPendingState, [queue]);
  useEffect(next, [queue]);

  const state = { rejected, resolved, isPending, count: items?.length ?? 0 };
  const actions = { retry };

  return [state, actions];
}

export default useQueue;
