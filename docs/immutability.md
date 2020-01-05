# Immutability

All objects and arrays in your store are immutable in order to be able
efficiently signal state changes to your components. This means whenever a
property changes on an object or array, a new copy of the object is created in
it's place. In Freedux this happens behind the scenes for you, except for when
you are setting objects themselves.

- When you are using a setter on an array or object, do not mutate the value.

```javascript
const updateTodoItem = useSetter(root => root.todos[index]);

updateTodoItem(item => {
  // Bad
  item.name = 'Hello';
});
```

- When you are using a setter on an array or object, you must return a new
  instantiation of the array or object.

```javascript
const updateTodoList = useSetter(root => root.todos);

const addItem = (item) =>

  // Bad
  updateTodoList(list => {
    list.push(item)
    // If we return the same array reference, the state
    // will not be updated.
    return list;
  });


  // Better
  updateTodoList(list => {
    const newList = list.slice();
    newList.push(item)
    return newList;
  });


  // Or this
  updateTodoList(list => [...list, item]);
}

```
