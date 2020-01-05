# createStore<T>(initialState: T): Store

Makes a new [store](store.md) that will contain the state of your application.
You must pass an initial state.

```javascript
import { createStore } from 'freedux';

const initialState = {
  count: 0;
  todos: []
};

const store = createStore(initialState);
```
