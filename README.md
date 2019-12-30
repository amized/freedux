# React Free State

Single-tree, type safe state management for React without the bloat.

## Introduction

For React there are many ways of managing the state of your application. Since hooks have become popular a common pattern is to default to using a `useState` hook. 

For those familiar with redux, freedux also uses a single immutable object tree to store the state of your application. But unlike redux, the Api requires minimum boiler plate code, freeing you from the bloat of reducers, actions, context, and dealing with immutability.

## Usage

#### 1. Create your store and inject into a Provider:

```javascript
import { Provider } from "react-global-state";

const store = createStore<AppState>({
  todos: [{
    name: 'bar'
  }]
});

// Wrapper component
<Provider store={store}>
 ...
</Provider>


```


#### 2. Use the `useListener` hook to select and inject state into your component:

```javascript
const TodoList: React.FC = () => {
  const todos = useListener(state => state.todos);
  return (
    <>
      {todos.map(todoItem => (
        ...
      ))}
    </>
  );
};
```

#### 3. Use the `useSetter` hook to update your state: 

You pass a function that returns the property you want to update. The hook returns a setter function to do that work.

```javascript
const TodoName: React.FC = () => {
  const setName = useSetter(state => state.todos[0].name);
  return (
    <button onClick={()=>{setName('foo')}>
      Set the first name
    </button>
  );
};
```

And that's the gist of it. Please read the tips and gotchas below and happy coding! This project uses a fork from the [ts-object-path](https://github.com/Taras-Tymchiy/ts-object-path#readme) library.
## API

###`createStore<T>(initialState: T): Store`

Makes a new store and initializes with the passed state and type.


###`useListener(selector: Selector<T, V>): V `

A React hook to retrieve a value from your store. Pass a function which selects (or calculates) the data from the root state. Your component will only re-render when your selector result changes.


###`useSetter(selector: Selector<T, V>): Function`

A React hook to retrieve a function that will update the state. Pass a function which selects the property within your tree that you want to update.

#### Example
Let's say our state shape looks like this:

```
const rootState = {
  a: {
    b: {
      c: 0
    }
  }
}
```

To update the `c` property you would use:

```
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


Often we need to factor in the existing state when calculating what the next state should be. Similar to the React `useState` hook, `useSetter` lets you pass in an updater function instead of a value. Your function needs to return the next state based on the current state.
#### Example
Take a counter state:

```
const store = createStore({
  counter: {
    count: 0
  }
})
```

To make an increment function you can do this:

```
const MyComponent = () => {
  const updateCount = useUpdater(root => root.counter.count);  
  const doCount = () => {
    updateCount(count => count + 1);
  }

  // doCount() updates the state to { counter: { count: 1 }}
  ...
};
```

You can also use any part of the state tree in your calculation by looking at the `rootState` passed as the second argument to your updater function:

```
const store = createStore({
  counter: {
    count: 0,
    countBy: 2
  }
});

const MyComponent = () => {
  const updateCount = store.useUpdater(root => root.counter.count);
  const doCount = () => {
    updateCount((count, rootState) => count + rootState.counter.countBy);
  };
  
  // doCount() updates the state to { counter: { count: 2 }}
  ...
};

```
This saves you from having to use a `useListener` hook in your component if you just need the state for the purpose of the update, rather than for rendering.

### `store.subscribe(cb: Function): Function`

Subscribes to all state changes in your store using a callback function. The updated root state is passed the callback. 

Returns a function that will unsubscribe your callback.

This method is intended for use outside of React, and should be used for any application level side effects for your state changes. This includes things like saving your store to local storage or a server

##Tips

### Calculations

If you are running expensive calculations inside your selectors for `useListener()`, keep in mind that it may be called several times on each render.

```
const MyComponent = () => {
	const result = store.useListener(state => someExpensiveFunction(state.todos));
	...	
});

```

To optimize this behavior, we recommend using the `useListener` hook to listen to the raw state, and then calculating your result with `useMemo`.

```
const MyComponent = () => {
	const todos = store.useListener(state => state.todos);
	const result = useMemo(() => someExpensiveFunction(todos), [todos]);
});

```



###Immutability

All objects and arrays in your store are immutable in order to be able efficiently signal state changes to your components. This means you need to make sure:

* You never mutate any part of the state directly in your updater or selector functions.
* When you are using an updater on an array or object, you must return a new instantiation of the array or object.

```
const updateTodoList = store.useUpdater(root => root.todos);

const addItem = () =>

  // BAD
  updateTodoList(list => {
    list.push({ ... })
    return list;
  });


  // BETTER
  updateTodoList(list => {
    const newList = list.slice();
    newList.push({ ... })
    return newList;
  });


  // BUT YOU MAY FIND THIS NICER
  updateTodoList(list => [...list, { ... }]);
  
}

```


### Stucturing of selectors for `useSetter` and `useUpdater`

Your selector function is only allowed to return a value that can be accessed from the root state, either using the `.` notation for object properties or `[]` for array values. If you try to call a function or perform any calculations in your selector an error will be thrown. 

```
// State looks like
{
  a: {
    b: [
      {
        id: 4,
        name: 'name'
      }
      ...
    ]
  }
}


// BAD
const setItem = store.useSetter(root => 
  root.a.b.find(item => item.id === props.id)
)

// BETTER
const list = store.useListener(root => root.a.b)
const index = list.findIndex(item => item.id === props.id);
const setItem = store.useSetter(root => root.a.b[index]);


```

### Setting properties of undefined in typescript

Take the following state shape:

```
interface State {
  a?: {
    b: number;
  }
}

const store = createStore<State>({});
```

What if we try to use a setter function for the property `b` of a non existent object?

```
// Inside component
const setB = store.useSetter(root => root.a.b) 

// Typescript error: Object is possibly 'undefined'
```

We cannot set `b` before making sure `a` exists. The way to create a setter here is to use a conditional, and make sure the return value traces an object path to our value, or is `undefined` if the path is not found:

```
// Inside component
const setB = store.useSetter(root => root.a ? root.a.b : undefined);
```

Note that now, if `a` is undefined, calling our setter function will do nothing. It won't try to create the intermediary objects of the path because it doesn't know how to build those objects. You will need to set `a` yourself first.




