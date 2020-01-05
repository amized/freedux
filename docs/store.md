# Store

The store is an object that provides the methods to interact with your state
tree, and is created using [createStore()](create-store.md). A store provides
the following methods:

## useListener()

`useListener(selector: Selector<T, V>): V`

A React hook to retrieve a value from your store. Pass a function which selects
(or calculates) the data from the root state. Your component will only re-render
when your selector result changes.

```javascript
import { createStore } from 'freedux';

const { useListener } = createStore({
  a: {
    b: {
      c: 0
    }
  }
});

const MyComponent = () => {
  const c = useListener(root => root.a.b.c);
  return <>{c}</>;
};
```

## useSetter()

`useSetter(selector: Selector<T, V>): Function`

A React hook to retrieve a function that will update the state. Pass a function
which selects the property within your tree that you want to update.

Let's say our state shape looks like this:

```javascript
const { useSetter } = createStore({
  a: {
    b: {
      c: 0
    }
  }
});
```

To update the `c` property you would use:

```javascript
const MyComponent = () => {
  const setC = useSetter(root => root.a.b.c)
  return (
  	<button onClick={() => { setC(5); }}/>
  	  Set to 5
  	</button>
  )

  // State updates to { a: { b: { c: 5 }}}
  ...
```

#### Using an update function

Often we need to factor in the current state when calculating what the next
state should be. Similar to the React `useState` hook, `useSetter` lets you pass
in an updater function instead of a value. Your function needs to return the
next state based on the current state.

Take a counter example:

```javascript
const { useSetter } = createStore({
  counter: {
    count: 0
  }
});
```

To make an increment function you can do this:

```javascript
const CountButton = () => {
  const updateCount = useSetter(root => root.counter.count);
  const increment = () => {
    updateCount(count => count + 1);
  };

  return (
    <button
      onClick={() => {
        increment();
      }}
    >
      Count
    </button>
  );
};

// Updates the state to { counter: { count: 1 }}
```

#### Using other parts of your state to compute the next state

You can also use any part of the state tree in your calculation by looking at
the `rootState` passed as the second argument to your updater function:

```javascript
import { createStore } from 'freedux';

const { useSetter } = createStore({
  counter: {
    count: 0,
    countBy: 2
  }
});

const CountButton = () => {
  const updateCount = useSetter(root => root.counter.count);
  const doCount = () => {
    updateCount((count, rootState) => count + rootState.counter.countBy);
  };

  return (
    <button
      onClick={() => {
        doCount();
      }}
    >
      Count
    </button>
  );
};

// Updates the state to { counter: { count: 2 }}
```

This saves you from having to use a `useListener` hook in your component if you
just need the state for the purpose of the update, rather than for rendering.

## createSetter()

`createSetter(selector: Selector<T, V>): Function`

Being almost identical to `useSetter`, `createSetter` returns a function that
will update your state, but can be used outside of a react component. This
allows you to have any type event interact with your state.

```javascript
const { createSetter } = createStore({
  auth: {
    loggedIn: false
  }
});

const setLoggedIn = createSetter(root => root.auth.loggedIn);

// Some authentication library
lib.onLogin(() => {
  setLoggedIn(true);
});
```

## batch()

`batch(fn: Function): void`

If you need to run multiple calls to setters sequentially, wrap them in a
`batch()` so that listeners only get notified once after the batch is complete.
This is an optimization that you probably won't need, but could help performance
if you have a large number of components all using listeners.

```javascript
const { batch, createSetter } = createStore({
  count: 0
});

const setCount = createSetter(root => root.count);

batch(() => {
  setCount(1);
  setCount(2);
  setCount(1000);
});

// State only updates once
```

## subscribe()

`subscribe(cb: Function): Function`

Subscribes to all state changes in your store using a callback function. The
updated root state is passed to your callback. This can be used for any
application level side effects for your state changes - things like saving your
store to local storage or a server, debug scripts, analytics etc.

`subscribe` returns a function that will unsubscribe your callback.

```javascript
const unsubscribe = store.subscribe(state => {
  console.log('The new state: ', state);
});
```
