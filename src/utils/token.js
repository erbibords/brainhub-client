const TOKEN_STORAGE_KEY = 'token';
const PRIMARY_BRANCH_STORAGE_KEY = 'branchId';
const EMULATED_BRANCH_STORAGE_KEY = 'emulatedBranch';
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

export const setEmulatedBranch = (branch) => {
  if (!branch) {
    clearEmulatedBranch();
    return;
  }

  const payload = typeof branch === 'string' ? { id: branch } : branch;
  console.log('Setting emulated branch', payload);
  localStorage.setItem(EMULATED_BRANCH_STORAGE_KEY, JSON.stringify(payload));
};

export const getEmulatedBranch = () => {
  const storedValue = localStorage.getItem(EMULATED_BRANCH_STORAGE_KEY);
  if (!storedValue) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(storedValue);
    if (parsed && typeof parsed === 'object' && parsed.id) {
      return parsed;
    }
    // fallback for legacy string storage
    return { id: storedValue };
  } catch (error) {
    return { id: storedValue };
  }
};

export const clearEmulatedBranch = () => {
  console.log('Clearing emulated branch ID');
  localStorage.removeItem(EMULATED_BRANCH_STORAGE_KEY);
};

export const getEffectiveBranch = () => {
  const emulatedBranch = getEmulatedBranch();
  if (emulatedBranch?.id) {
    console.log('Fetching emulated branch id ', emulatedBranch.id);
    return emulatedBranch.id;
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
