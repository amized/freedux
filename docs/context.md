# Using React context

Freedux is unopinionated about whether to use
[React context](https://reactjs.org/docs/context.html) to share your store
between components. It's fine to think of your Freedux store as a shared module
that can be imported into the components that need them. If you want to use the
"shared module" approach, we recommend putting your set up code into `store.js`
and importing your hooks from there:

```javascript
// store.js
import { createStore } from 'freedux';

const { useSetter, useListener } = createStore(...);
export { useSetter, useListener };


// component.js
import { useListener } from './store.js';
```

However if you do wish to use context, it's fairly easy to implement with the
latest context api:

```javascript
// store-context.js
import { createContext } from 'react';
import createStore from './create-store';

export const store = createStore(...);
export const StoreContext = createContext(store);


// app.js
// Wrap your app in a Provider
import { StoreContext, store } from './store-context.js';

const App = () => (
  <StoreContext.Provider value={store}>
     ...
  </StoreContext.Provider>
);


// hooks.js
// Make some custom hooks
import { useContext } from 'react';
import { StoreContext } from './store-context.js';

export const useListener = () => useContext(StoreContext).useListener;
export const useSetter = () => useContext(StoreContext).useSetter;

// component.js
import { useListener } from './hooks';
...
```
