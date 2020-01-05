import { useState, useEffect, useRef, useCallback } from 'react';
import { set, getPath } from './ts-object-path';
import { Selector, Store, ObjProxyArg, Updater, Setter } from './types';

function isUpdater<T, TSelected>(
  action: TSelected | Updater<T, TSelected>
): action is Updater<T, TSelected> {
  return typeof action === 'function';
}

function createStore<T>(initialState: T): Store<T> {
  let rootState = initialState;
  let isBatching = false;
  const subscriptions: Array<(state: T) => void> = [];

  function subscribe(fn: (state: T) => void) {
    subscriptions.push(fn);
    return () => {
      const index = subscriptions.indexOf(fn);
      subscriptions.splice(index, 1);
    };
  }

  function notifyChange(): void {
    subscriptions.forEach(fn => fn(rootState));
  }

  function batch(fn: Function): void {
    const stateBefore = rootState;
    isBatching = true;
    fn();
    isBatching = false;
    if (stateBefore !== rootState) {
      notifyChange();
    }
  }

  function useListener<TSelected>(selector: Selector<T, TSelected>) {
    const [localState, setLocalState] = useState<TSelected>(
      selector(rootState)
    );
    const prevSelected = useRef<TSelected>(localState);
    useEffect(() => {
      function handleChange(newState: T) {
        const newSelected = selector(newState);
        if (newSelected !== prevSelected.current) {
          setLocalState(newSelected);
        }
        prevSelected.current = newSelected;
      }

      return subscribe(handleChange);
    }, [selector]);
    return localState;
  }

  function createSetter<TSelected>(selector: Selector<T, TSelected>) {
    const proxySelector = (selector as any) as ObjProxyArg<T, TSelected>;
    const path = getPath(proxySelector);

    const doSet: Setter<T, TSelected> = action => {
      let newValue: TSelected;
      if (isUpdater(action)) {
        const currentValue = selector(rootState);
        newValue = action(currentValue, rootState);
      } else {
        newValue = action;
      }
      const newState = set(rootState, newValue, path);
      if (newState !== rootState) {
        rootState = newState;
        if (!isBatching) {
          notifyChange();
        }
      }
    };

    return doSet;
  }

  function useSetter<TSelected>(selector: Selector<T, TSelected>) {
    const setter = createSetter(selector);
    return useCallback(setter, [selector]);
  }

  return {
    subscribe,
    useListener,
    useSetter,
    createSetter,
    batch
  };
}

export default createStore;
