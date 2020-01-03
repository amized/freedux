# \<StoreProvider\>

A wrapper component which injects your Store into the React context, allowing
the `useSetter` and `useListener` hooks to interact with your store. Pass your
store into the `store` prop.

```javascript
import { StoreProvider } from 'react-global-state';

const App = () => (
  <StoreProvider store={store}>...</StoreProvider>;
)
```
