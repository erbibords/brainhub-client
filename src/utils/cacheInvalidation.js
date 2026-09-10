import { mutate as swrMutate } from "swr";

const matchesCachePattern = (key, pattern) => {
  if (typeof key !== "string" || typeof pattern !== "string") return false;
  if (key.startsWith(pattern) || key.includes(pattern)) return true;

  const normalized = pattern.replace(/[-*]+$/g, "");
  if (!normalized) return false;

  const pathToken = `/${normalized}`;
  return (
    key.includes(`${pathToken}/`) ||
    key.includes(`${pathToken}?`) ||
    key.endsWith(pathToken)
  );
};

export const invalidateCacheByPattern = (patterns) => {
  const patternArray = Array.isArray(patterns) ? patterns : [patterns];
  return swrMutate(
    (key) => patternArray.some((pattern) => matchesCachePattern(key, pattern)),
    undefined,
    { revalidate: true }
  );
};
