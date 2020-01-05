# Derived Data

If you are running expensive calculations inside your selectors for
`useListener()` to compute derived data, keep in mind that it may be called
several times on each render.

```javascript
const MyComponent = () => {
	const result = store.useListener(state => someExpensiveFunction(state.todos));
	...
});

```

To optimize this behavior, we recommend using the `useListener` hook to listen
to the raw state, and then calculating your result with `useMemo` from React.

```javascript
import { useMemo } from 'react';

const MyComponent = () => {
	const todos = useListener(state => state.todos);
	const result = useMemo(() => someExpensiveFunction(todos), [todos]);
});

```
