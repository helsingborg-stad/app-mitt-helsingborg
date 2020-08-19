import { useReducer, useRef, useEffect, useCallback } from 'react';

//   export interface SideEffect<S, A, C> {
//     (state: S, action: A, context: C): Promise<A | void>;
//   }

//   export interface ActionWithEffects<S, A, C> {
//     effects?: SideEffect<S, A, C>;
//   }
/**
 *
 * @param {*} reducer the reducer to wrap
 * @param {*} state0 initial state for reducer
 * @param {*} effectContext initial context (which is an object) for the effects
 */
const useReducerWithEffects = (reducer, state0, effectContext) => {
  const [state, reactDispatch] = useReducer(reducer, state0);
  const actions = useRef([]);

  const dispatch = useCallback(
    action => {
      // use setTimeout to sever any links to the calling
      // component.
      //
      // There was an issue in deeper components (not App.tsx)
      // dispatching actions with side effects from a `useEffect`
      // hook (think fetching data on initial page load while
      // showing a loading indicator).
      //
      // This seemed to be something internal to React, possibly
      // related to React Fiber, that meant effect functions
      // running here (at the App.tsx level) received the old
      // state, not the state containing any updates from that
      // action.
      //
      // The whole premise of these side effects is that the
      // action has updated state before running the effects,
      // and the effect gets the latest state.
      //
      // You can see this by comenting out the `setTimeout`,
      // and clicking reload on the page preview.
      // The async incrementer tries to start immediately on
      // page load but you can see in the consoler the effect
      // receives the "old" initial app state, with
      // `incrementAfterSeconds: NaN`, so it stops there.
      //
      // If you keep the below `setTimeout`, then the effect
      // receives the correctly updated state with
      // `incrementAfterSeconds: 3`, and it continues to tick
      // the timer until incrementing or cancelling.
      //
      // Alternatively, if the `Incrementer` component was
      // did not exist, or did not use `useEffect`, then we
      // wouldn't see any issue at all because everything is
      // done at the App.tsx component level of the tree.
      setTimeout(() => {
        if (action.effects) actions.current.push(action);

        reactDispatch(action);
      }, 1000);
    },
    [reactDispatch]
  );

  useEffect(() => {
    actions.current.forEach(async action => {
      if (action.effects) {
        const nextAction = await action.effects(state, action, effectContext);

        if (nextAction) dispatch(nextAction);
      }
    });

    actions.current = [];
  }, [state, dispatch, effectContext]);

  return [state, dispatch];
};

export default useReducerWithEffects;
