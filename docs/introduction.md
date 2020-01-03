# Freedux

Single tree global state management for the modern React, without the bloat.

The idea of Freedux is to give you a single, immutable, strongly typed object
tree that can be shared easily across your components. This is similar to redux,
but unlike redux, the Api is super simple and requires minimum boiler plate code
to use.

## Features

- Lightweight - 5k zipped
- Modern hooks based API
- Render optimization
- APIs for usage outside of React
- State represented in plain JS primitives and objects
- Strongly typed

This project uses a fork from the
[ts-object-path](https://github.com/Taras-Tymchiy/ts-object-path#readme)
library.

## Install

```console
npm install freedux
```

## Usage

### 1. Create your store

```javascript
import { createStore } from 'freedux';

// Define your initial state
const initialState = {
  count: 0
};

// Create your store to retrieve some hooks
const { useListener, useSetter } = createStore(initialState);
```

### 2. Listen to state changes

Use the `useListener` hook to select and inject state into your component:

```javascript
const CountDisplay = () => {
  const count = useListener(state => state.count);
  return <>{count}</>;
};
```

### 3. Make updates

Use the `useSetter` hook to update your store. You pass a function that returns
the property you want to update. The hook returns a setter function to do that
work:

```javascript
const CountButton = () => {
  const setCount = useSetter(state => state.count);
  return (
    <button onClick={()=>{setCount(5)}>
      Set the counter to 5
    </button>
  );
};
```

Those are the basics. Check out the [example](example.md) and
[API docs](example.md), and happy coding!
