import React from 'react';
import createStore from '../src/create-store';
import { renderHook, act } from '@testing-library/react-hooks';
import { act as reactDomAct } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import sinon from 'sinon';
interface State {
  a: {
    a1: {
      a11: number;
    };
    b1: Array<string>;
  };
  b: Array<{
    id: string;
    name: string;
  }>;
  c: Function | null;
  d?: number;
}

const initialState: State = {
  a: {
    a1: {
      a11: 5
    },
    b1: ['one']
  },
  b: [
    {
      id: '123',
      name: 'John'
    }
  ],
  c: () => null
};

describe('Create store', () => {
  it('Should have the correct methods', () => {
    const store = createStore(initialState);
    expect(store).toHaveProperty('useSetter');
    expect(store).toHaveProperty('useListener');
  });
});

describe('store.useListener', () => {
  it('Should read the current state', () => {
    const store = createStore(initialState);
    const { result } = renderHook(() =>
      store.useListener(root => root.a.a1.a11)
    );
    expect(result.current).toBe(5);
  });

  it('Should update the component if the part of state Im listening to changes', () => {
    const store = createStore(initialState);
    let renderCount = 0;

    const Wrapper = () => {
      renderCount++;
      const value = store.useListener(root => root.a.a1.a11);
      return <div>{value}</div>;
    };

    render(<Wrapper />);
    expect(renderCount).toBe(1);
    const setter = renderHook(() => store.useSetter(root => root.a.a1.a11));
    reactDomAct(() => {
      setter.result.current(4);
    });
    expect(renderCount).toBe(2);
  });

  it('Should not update the component if a change happens that Im not listening to', () => {
    const store = createStore(initialState);
    let renderCount = 0;

    const Wrapper = () => {
      renderCount++;
      const value = store.useListener(root => root.a.a1.a11);
      return <div>{value}</div>;
    };

    render(<Wrapper />);
    expect(renderCount).toBe(1);
    const setter = renderHook(() => store.useSetter(root => root.a.b1));
    reactDomAct(() => {
      setter.result.current(['two']);
    });
    expect(renderCount).toBe(1);
  });

  it('Should not update the component if we call set with the same value', () => {
    const store = createStore(initialState);
    let renderCount = 0;

    const Wrapper = () => {
      renderCount++;
      const value = store.useListener(root => root.a.a1.a11);
      return <div>{value}</div>;
    };

    render(<Wrapper />);
    expect(renderCount).toBe(1);
    const setter = renderHook(() => store.useSetter(root => root.a.a1.a11));
    reactDomAct(() => {
      setter.result.current(5);
    });
    expect(renderCount).toBe(1);
  });

  it('Should update the component if any child nodes change', () => {
    const store = createStore(initialState);
    let renderCount = 0;

    const Wrapper = () => {
      renderCount++;
      const value = store.useListener(root => root.a.b1);
      return <div>{value}</div>;
    };

    render(<Wrapper />);
    expect(renderCount).toBe(1);
    const setter = renderHook(() => store.useSetter(root => root.a.b1[0]));
    reactDomAct(() => {
      setter.result.current('hello');
    });
    expect(renderCount).toBe(2);
  });
});

describe('store.useSetter', () => {
  it('Use setter should update the state', () => {
    const store = createStore(initialState);
    const { result } = renderHook(() =>
      store.useListener(root => root.a.a1.a11)
    );
    const setter = renderHook(() => store.useSetter(root => root.a.a1.a11));
    act(() => {
      setter.result.current(4);
    });

    expect(result.current).toBe(4);
  });

  it('Use setter should update the state when passing an update function to the setter', () => {
    const store = createStore(initialState);
    const { result } = renderHook(() =>
      store.useListener(root => root.a.a1.a11)
    );
    const setter = renderHook(() => store.useSetter(root => root.a.a1.a11));
    act(() => {
      setter.result.current(value => value + 1);
    });

    expect(result.current).toBe(6);
  });
});

describe('store.subscribe', () => {
  it('Should call the callback whenever the state changes', () => {
    const store = createStore(initialState);
    const spy = sinon.spy();
    store.subscribe(spy);

    const setter = renderHook(() => store.useSetter(root => root.a.a1.a11));
    act(() => {
      setter.result.current(2);
    });

    expect(spy.callCount).toBe(1);
  });

  it('Should return a method that unsubscribes', () => {
    const store = createStore(initialState);
    const spy = sinon.spy();
    const unsubscribe = store.subscribe(spy);
    unsubscribe();
    const setter = renderHook(() => store.useSetter(root => root.a.a1.a11));
    act(() => {
      setter.result.current(2);
    });

    expect(spy.callCount).toBe(0);
  });
});

describe('store.batch', () => {
  it('Should update the store', () => {
    const store = createStore({ count: 0 });
    const setCount = store.createSetter(root => root.count);
    const { result } = renderHook(() => store.useListener(root => root.count));

    expect(result.current).toBe(0);

    act(() => {
      store.batch(() => {
        setCount(5);
      });
    });

    expect(result.current).toBe(5);
  });

  it('Should only result in a single render', () => {
    const store = createStore({ count: 0 });
    const setCount = store.createSetter(root => root.count);
    let renderCount = 0;

    const Wrapper = () => {
      renderCount++;
      const value = store.useListener(root => root.count);
      return <div id="id">{value}</div>;
    };

    const result = render(<Wrapper />);
    expect(renderCount).toBe(1);

    reactDomAct(() => {
      store.batch(() => {
        setCount(5);
        setCount(6);
        setCount(7);
        setCount(8);
      });
    });
    expect(renderCount).toBe(2);
  });
  it('Should not update if there was no change', () => {
    const store = createStore({ count: 0 });
    const setCount = store.createSetter(root => root.count);
    let renderCount = 0;

    const Wrapper = () => {
      renderCount++;
      const value = store.useListener(root => root.count);
      return <div id="id">{value}</div>;
    };

    const result = render(<Wrapper />);
    expect(renderCount).toBe(1);

    reactDomAct(() => {
      store.batch(() => {
        setCount(0);
        setCount(0);
      });
    });
    expect(renderCount).toBe(1);
  });
});
