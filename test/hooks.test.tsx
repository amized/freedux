import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import createStore from '../src/create-store';
import StoreProvider from '../src/provider';
import useSetter from '../src/use-setter';
import useListener from '../src/use-listener';

interface State {
  a: string;
}

const initialState: State = {
  a: 'The value'
};

const store = createStore(initialState);

const Child: React.FC = () => {
  const a = useListener((state: State) => state.a);
  const setA = useSetter((state: State) => state.a);
  return (
    <>
      {a}
      <button onClick={() => setA('New value')}>Set</button>
    </>
  );
};

describe('hooks', () => {
  it('useListener should listen to updates from the provided store', () => {
    const { getByText } = render(
      <StoreProvider value={store}>
        <Child />
      </StoreProvider>
    );
    expect(getByText('The value')).toBeInTheDocument();
  });

  it('useSetter should update the store', () => {
    const { getByText } = render(
      <StoreProvider value={store}>
        <Child />
      </StoreProvider>
    );
    fireEvent.click(screen.getByText(/set/i));
    expect(getByText('New value')).toBeInTheDocument();
  });
});
