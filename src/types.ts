export type Selector<T, TSelected> = (state: T) => TSelected;

export type Updater<T, TSelected> = (
  value: TSelected,
  rootState: T
) => TSelected;

export type Setter<T, TSelected> = (
  action: TSelected | Updater<T, TSelected>
) => void;

export type UseListener<T, TSelected> = {
  (selector: Selector<T, TSelected>): TSelected;
};

export interface Store<T> {
  subscribe(fn: (state: T) => void): () => void;
  useListener<TSelected>(selector: Selector<T, TSelected>): TSelected;
  createSetter<TSelected>(
    selector: Selector<T, TSelected>
  ): Setter<T, TSelected>;
  useSetter<TSelected>(selector: Selector<T, TSelected>): Setter<T, TSelected>;
  batch(fn: Function): void;
}

export type ObjPathProxy<TRoot, T> = {
  [P in keyof T]: ObjPathProxy<TRoot, T[P]>;
};

export type ObjProxyArg<TRoot, T> =
  | ObjPathProxy<TRoot, T>
  | ((p: ObjPathProxy<TRoot, TRoot>) => ObjPathProxy<TRoot, T>);
