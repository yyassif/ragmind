/**
 * The removeUndefined function takes an object obj as input and returns a new object with any properties that have the value undefined removed.
 * @param obj - The object to remove undefined properties from
 * @returns A new object with any properties that have the value undefined removed
 **/

export const removeUndefined = <T extends Record<string, unknown>>(
  obj: T
): Partial<T> => {
  const newObj = {} as Partial<T>;
  for (const key in obj) {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  }

  return newObj;
};
