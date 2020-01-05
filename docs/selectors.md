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


// BAD
const setItem = useSetter(root =>
  root.todos.find(item => item.id === props.id)
)

// BETTER
const index = useListener(root => root.todos.findIndex(i => i.id === item.id));
const setItem = useSetter(root => root.todos[index]);
```

Consider also, that if you're trying to access an object based on its id
property, an array structure for your store may not be the best choice. You
could store items as a map, and then convert them into an array for rendering.
