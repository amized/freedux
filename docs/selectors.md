# Structuring of selectors for useSetter and createSetter

Your selector function is only allowed to return a value that can be accessed
from the root state, either using the `.` notation for object properties or `[]`
for array values. This is so that Freedux can trace an object path that it will
use for setting your values. If you try to call a function on a value or perform
any calculations using a value in your selector, an error will be thrown.

```javascript
const {useSetter, useListener} = createStore({
  todos: [
    {
      id: 4,
      name: 'name'
    }
    ...
  ]
});


// Assume the item id is passed through props
const TodoItemCard = () => {

  // Bad
  // An error will be thrown because we cannot
  // call a method on our state inside the selector
  const setItem = useSetter(root =>
    root.todos.find(todo => todo.id === props.id)
  )

  // Better
  const index = useListener(root => root.todos.findIndex(todo => todo.id === props.id));
  const setItem = useSetter(root => root.todos[index]);

  ...
}
```

If it's inconvininent for you to use the index to find the object, or if you
want to optimize performance, you can create a custom function which uses a
setter on the containing object. The setter update function can do the work of
finding which item needs to be updated and return a new list. This saves you
from having to use a `useListener`:

```javascript
const TodoItemCard = () => {
  const setTodos = useSetter(root => root.todos);

  const setItem = (data: TodoItem) => {
    setTodos(todos => {
      return todos.map(todo => (todo.id === props.id ? data : todo));
    });
  };

  ...

  setItem({
    id: 5,
    name: 'Some new todo'
  });
```
