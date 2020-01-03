# Setting properties of undefined in typescript

Take the following state shape:

```javascript
interface State {
  a?: {
    b: number
  };
}

const store = createStore < State > {};
```

What if we try to use a setter function for the property `b` of a non existent
object?

```javascript
// Inside component
const setB = store.useSetter(root => root.a.b);

// Typescript error: Object is possibly 'undefined'
```

We cannot set `b` before making sure `a` exists. The way to create a setter here
is to use a conditional, and make sure the return value traces an object path to
our value, or is `undefined` if the path is not found:

```javascript
// Inside component
const setB = store.useSetter(root => (root.a ? root.a.b : undefined));
```

Note that now, if `a` is undefined, calling our setter function will do nothing.
It won't try to create the intermediary objects of the path because it doesn't
know how to build those objects. You will need to set `a` yourself first.
