# Setting properties of undefined in typescript

Take the following state shape:

```typescript
interface State {
  a?: {
    b: number;
  };
}

const { useSetter } = createStore<State>({});
```

Notice we cannot set `b` before making sure `a` exists.

```javascript
// Inside component
const setB = useSetter(root => root.a.b);

// Typescript error: Object is possibly 'undefined'
```

The way to create a setter here is to use a conditional, and make sure the
return value traces an object path to our value, or is `undefined` if the path
is not found:

```javascript
// Inside component
const setB = useSetter(root => (root.a ? root.a.b : undefined));
```

Note that now, if `a` is undefined, calling our setter function will do nothing.
It won't try to create the intermediary objects of the path because it doesn't
know how to build those objects. You will need to set `a` yourself first.
