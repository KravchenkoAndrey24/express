export const mapObject = <T extends object, U>(inputObject: T, outputKeys: (keyof T & keyof U)[]): U => {
  const result = {} as U;
  outputKeys.forEach((key) => {
    if ((key as string) in inputObject) {
      result[key] = inputObject[key as keyof T] as any;
    }
  });
  return result;
};
