import { createContext } from 'react';
import createStore from './create-store';
import { Store } from './types';

const defaultStore = createStore({});

const StoreContext = createContext<Store<any>>(defaultStore);

export default StoreContext;
