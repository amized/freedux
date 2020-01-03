# Stucturing of selectors for `useSetter` and `useUpdater`

Your selector function is only allowed to return a value that can be accessed
from the root state, either using the `.` notation for object properties or `[]`
for array values. If you try to call a function or perform any calculations in
your selector an error will be thrown.

```javascript
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
