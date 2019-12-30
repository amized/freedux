import { useContext } from 'react';
import StoreContext from './context';
import { Store, Selector } from './types';

export default function<TRoot, TSelected>(
  selector: Selector<TRoot, TSelected>
): TSelected {
  const store = useContext<Store<TRoot>>(StoreContext);
  return store.useListener(selector);
}
