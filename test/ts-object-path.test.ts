import { set } from '../src/ts-object-path';

describe('set()', () => {
  it('Should update the child state to a new value', () => {
    const obj = {
      a: 1,
      b: 'hello'
    };

    const updated = set(obj, 2, ['a']);

    expect(updated.a).toBe(2);
    expect(updated).not.toBe(obj);
  });

  it('Should preserve an existing value', () => {
    const obj = {
      a: 1,
      b: 'hello'
    };

    const updated = set(obj, 2, ['a']);
    expect(updated).not.toBe(obj);
    expect(updated.b).toBe(obj.b);
  });

  it('Should only return new objects for objects in the path', () => {
    const obj = {
      a: {
        a1: 2,
        a2: 5
      },
      b: {
        b1: {
          b11: 3
        },
        b2: {
          b11: 3
        }
      }
    };

    const updated = set(obj, 5, ['b', 'b1', 'b11']);
    expect(updated).not.toBe(obj);
    expect(updated.b).not.toBe(obj.b);
    expect(updated.b.b1).not.toBe(obj.b.b1);
    expect(updated.b.b1.b11).toBe(5);

    expect(updated.a).toBe(obj.a);
    expect(updated.b.b2).toBe(obj.b.b2);
  });

  it('Should not update if the searched path does not exist', () => {
    const obj = {
      b: {
        b1: undefined
      }
    };

    const updated = set(obj, 5, ['b', 'b1', 'b11']);
    expect(updated).toBe(obj);
  });

  it('Should set an undefined property to defined', () => {
    const obj = {
      b: {
        b1: undefined
      }
    };

    const updated = set(obj, 5, ['b', 'b1']);
    expect(updated).not.toBe(obj);
    expect(updated.b.b1).toBe(5);
  });
});
