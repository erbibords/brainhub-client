import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {
  clearEmulatedBranch,
  getActualBranch,
  getEmulatedBranch,
  getEffectiveBranch,
  setActualBranch,
  setEmulatedBranch,
} from '../utils/token';

const BranchContext = createContext({
  branchId: undefined,
  actualBranchId: undefined,
  emulatedBranch: undefined,
  isEmulating: false,
  setActualBranchId: () => {},
  setEmulatedBranchId: () => {},
  clearEmulatedBranchId: () => {},
  refreshBranchIds: () => {},
});

export const BranchProvider = ({ children }) => {
  const [actualBranchId, setActualBranchIdState] = useState(() =>
    getActualBranch()
  );
  const [emulatedBranch, setEmulatedBranchState] = useState(() =>
    getEmulatedBranch()
  );
  const [effectiveBranchId, setEffectiveBranchId] = useState(() =>
    getEffectiveBranch()
  );

  const syncFromStorage = useCallback(() => {
    const storedActualBranchId = getActualBranch();
    const storedEmulatedBranch = getEmulatedBranch();
    const storedEffectiveBranchId = getEffectiveBranch();

    setActualBranchIdState(storedActualBranchId ?? undefined);
    setEmulatedBranchState(storedEmulatedBranch ?? undefined);
    setEffectiveBranchId(storedEffectiveBranchId);
  }, []);

  useEffect(() => {
    syncFromStorage();
  }, [syncFromStorage]);

  const handleSetActualBranchId = useCallback((branchId) => {
    if (!branchId) {
      return;
    }
    setActualBranch(branchId);
    setActualBranchIdState(branchId);
    setEffectiveBranchId(getEffectiveBranch());
  }, []);

  const handleSetEmulatedBranchId = useCallback((branch) => {
    if (!branch) {
      clearEmulatedBranch();
      setEmulatedBranchState(undefined);
      setEffectiveBranchId(getEffectiveBranch());
      return;
    }

    setEmulatedBranch(branch);
    const normalizedBranch =
      typeof branch === 'string' ? { id: branch } : branch;
    setEmulatedBranchState(normalizedBranch);
    setEffectiveBranchId(getEffectiveBranch());
  }, []);

  const handleClearEmulatedBranchId = useCallback(() => {
    clearEmulatedBranch();
    setEmulatedBranchState(undefined);
    setEffectiveBranchId(getEffectiveBranch());
  }, []);

  const contextValue = useMemo(
    () => ({
      branchId: effectiveBranchId,
      actualBranchId,
      emulatedBranch,
      isEmulating: Boolean(emulatedBranch?.id),
      setActualBranchId: handleSetActualBranchId,
      setEmulatedBranchId: handleSetEmulatedBranchId,
      clearEmulatedBranchId: handleClearEmulatedBranchId,
      refreshBranchIds: syncFromStorage,
    }),
    [
      actualBranchId,
      emulatedBranch,
      effectiveBranchId,
      handleClearEmulatedBranchId,
      handleSetActualBranchId,
      handleSetEmulatedBranchId,
      syncFromStorage,
    ]
  );

  return (
    <BranchContext.Provider value={contextValue}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  return useContext(BranchContext);
};

export default BranchContext;

