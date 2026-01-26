import { mutate as swrMutate } from "swr";

export const invalidateCacheByPattern = (patterns) => {
  const patternArray = Array.isArray(patterns) ? patterns : [patterns];
  return swrMutate(
    (key) => typeof key === "string" && patternArray.some(p => key.startsWith(p)),
    undefined,
    { revalidate: true }
  );
};
