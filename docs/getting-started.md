# Getting Started

## 1. Create your store

```javascript
import { createStore } from 'react-global-state';

// Define your initial state
const initialState = {
  count: 0
};

// Create your store to retrieve some hooks
const { useListener, useSetter } = createStore(initialState);
```

## 2. Listen to state changes

Use the `useListener` hook to select and inject state into your component:

```javascript
const CountDisplay = () => {
  const count = useListener(state => state.count);
  return <>{count}</>;
};
```

## 3. Make updates

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

And that's the gist of it. Please read the tips and gotchas below and happy
coding!
