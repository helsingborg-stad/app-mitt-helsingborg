export interface ResolvedSettledPromise<T> {
  status: "fulfilled";
  value: T;
}
export interface RejectedSettledPromise {
  status: "rejected";
  reason: Error;
}

function toResolvedSettledPromise<T>(value: T): ResolvedSettledPromise<T> {
  return {
    status: "fulfilled",
    value,
  };
}

function toRejectedSettledPromise(reason: unknown): RejectedSettledPromise {
  return {
    status: "rejected",
    reason: reason as Error,
  };
}

export function allSettled<T>(
  promises: Promise<T>[]
): Promise<(ResolvedSettledPromise<T> | RejectedSettledPromise)[]> {
  const settlePromises = promises.map((p) =>
    p.then(toResolvedSettledPromise).catch(toRejectedSettledPromise)
  );

  return Promise.all(settlePromises);
}

export function isRejectedSettledPromise<T>(
  value: ResolvedSettledPromise<T> | RejectedSettledPromise
): value is RejectedSettledPromise {
  return value.status === "rejected";
}
