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
  emulatedBranchId: undefined,
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
  const [emulatedBranchId, setEmulatedBranchIdState] = useState(() =>
    getEmulatedBranch()
  );
  const [effectiveBranchId, setEffectiveBranchId] = useState(() =>
    getEffectiveBranch()
  );

  const syncFromStorage = useCallback(() => {
    const storedActualBranchId = getActualBranch();
    const storedEmulatedBranchId = getEmulatedBranch();
    const storedEffectiveBranchId = getEffectiveBranch();

    setActualBranchIdState(storedActualBranchId ?? undefined);
    setEmulatedBranchIdState(storedEmulatedBranchId ?? undefined);
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

  const handleSetEmulatedBranchId = useCallback((branchId) => {
    if (!branchId) {
      clearEmulatedBranch();
      setEmulatedBranchIdState(undefined);
      setEffectiveBranchId(getEffectiveBranch());
      return;
    }

    setEmulatedBranch(branchId);
    setEmulatedBranchIdState(branchId);
    setEffectiveBranchId(getEffectiveBranch());
  }, []);

  const handleClearEmulatedBranchId = useCallback(() => {
    clearEmulatedBranch();
    setEmulatedBranchIdState(undefined);
    setEffectiveBranchId(getEffectiveBranch());
  }, []);

  const contextValue = useMemo(
    () => ({
      branchId: effectiveBranchId,
      actualBranchId,
      emulatedBranchId,
      isEmulating: Boolean(emulatedBranchId),
      setActualBranchId: handleSetActualBranchId,
      setEmulatedBranchId: handleSetEmulatedBranchId,
      clearEmulatedBranchId: handleClearEmulatedBranchId,
      refreshBranchIds: syncFromStorage,
    }),
    [
      actualBranchId,
      emulatedBranchId,
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

