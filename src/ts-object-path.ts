import { ObjPathProxy, ObjProxyArg } from './types';

const pathSymbol = Symbol('Object path');

function createProxy<T>(path: PropertyKey[] = []): ObjPathProxy<T, T> {
  const proxy = new Proxy(
    { [pathSymbol]: path },
    {
      get(target, key) {
        if (key === pathSymbol) {
          return target[pathSymbol];
        }
        if (typeof key === 'string') {
          const intKey = parseInt(key, 10);
          if (key === intKey.toString()) {
            key = intKey;
          }
        }
        return createProxy([...(path || []), key]);
      }
    }
  );
  return (proxy as any) as ObjPathProxy<T, T>;
}

export function getPath<TRoot, T>(proxy: ObjProxyArg<TRoot, T>): PropertyKey[] {
  if (typeof proxy === 'function') {
    proxy = proxy(createProxy<TRoot>());
  }
  return (proxy as any)[pathSymbol];
}

export function set<TObj>(
  o: TObj,
  value: any,
  path: (string | number | symbol)[]
): TObj {
  const [key, ...remainingPath] = path;
  const keyTyped = key as keyof TObj;
  const currentValue = o[keyTyped];
  // We were expecting the child value to be an object
  if (
    path.length > 1 &&
    (typeof currentValue !== 'object' || currentValue === null)
  ) {
    console.warn(
      'Freedux: You are attempting to update the state of an unreachable property.'
    );
    return o;
  }

  const newValue =
    path.length > 1 ? set(currentValue, value, remainingPath) : value;

  if (newValue === currentValue) {
    return o;
  }

  if (typeof key === 'number' && Array.isArray(o)) {
    const arr = [...o];
    arr[key] = newValue;
    return arr as TObj & any[];
  } else {
    return { ...o, [key]: newValue };
  }
}
