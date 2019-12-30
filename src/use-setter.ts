import { useContext } from 'react';
import StoreContext from './context';
import { Store, Selector, Setter } from './types';

export default function<TRoot, TSelected>(
  selector: Selector<TRoot, TSelected>
): Setter<TRoot, TSelected> {
  const store = useContext<Store<TRoot>>(StoreContext);
  return store.useSetter(selector);
}
