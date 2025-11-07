const TOKEN_STORAGE_KEY = 'token';
const PRIMARY_BRANCH_STORAGE_KEY = 'branchId';
const EMULATED_BRANCH_STORAGE_KEY = 'emulatedBranchId';
const DEFAULT_BRANCH_FALLBACK = '5fc8fbbb-c0b0-410e-a571-ccf1129b523b';

export const setToken = (token) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const removeToken = () => {
  return localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const setActualBranch = (branchId) => {
  console.log('Setting actual branch id ', branchId);
  localStorage.setItem(PRIMARY_BRANCH_STORAGE_KEY, branchId);
};

export const getActualBranch = () => {
  return localStorage.getItem(PRIMARY_BRANCH_STORAGE_KEY);
};

export const setEmulatedBranch = (branchId) => {
  console.log('Setting emulated branch id ', branchId);
  localStorage.setItem(EMULATED_BRANCH_STORAGE_KEY, branchId);
};

export const getEmulatedBranch = () => {
  return localStorage.getItem(EMULATED_BRANCH_STORAGE_KEY) ?? undefined;
};

export const clearEmulatedBranch = () => {
  console.log('Clearing emulated branch ID');
  localStorage.removeItem(EMULATED_BRANCH_STORAGE_KEY);
};

export const getEffectiveBranch = () => {
  const emulatedBranchId = getEmulatedBranch();
  if (emulatedBranchId) {
    console.log('Fetching emulated branch id ', emulatedBranchId);
    return emulatedBranchId;
  }

  const branchId = getActualBranch();
  console.log('Fetching actual branch id ', branchId ?? DEFAULT_BRANCH_FALLBACK);
  return branchId ?? DEFAULT_BRANCH_FALLBACK;
};

export const clearBranchIdentifiers = () => {
  console.log('Removing all branch identifiers');
  localStorage.removeItem(PRIMARY_BRANCH_STORAGE_KEY);
  localStorage.removeItem(EMULATED_BRANCH_STORAGE_KEY);
};

// Backwards compatible exports
export const setBranch = setActualBranch;
export const getBranch = getEffectiveBranch;
export const removeBranch = clearBranchIdentifiers;
