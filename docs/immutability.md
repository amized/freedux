# Immutability

All objects and arrays in your store are immutable in order to be able
efficiently signal state changes to your components. This means you need to make
sure:

- You never mutate any part of the state directly in your setter or selector
  functions.
- When you are using a setter on an array or object, you must return a new
  instantiation of the array or object.

```javascript
const updateTodoList = store.useUpdater(root => root.todos);

const addItem = (item) =>

  // BAD
  updateTodoList(list => {
    list.push(item)
    return list;
  });


  // BETTER
  updateTodoList(list => {
    const newList = list.slice();
    newList.push(item)
    return newList;
  });


  // OR THIS
  updateTodoList(list => [...list, item]);

}

```
