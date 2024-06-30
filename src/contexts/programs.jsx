import React, { createContext, useMemo, useState, useContext } from "react";
import usePrograms from "../hooks/usePrograms";

const ProgramsContext = createContext({
  programs: [],
  programsLoading: false,
  programsError: false,
  setParams: (params) => {},
});

export const ProgramsProvider = ({ children }) => {
  const [params, setParams] = useState({
    name: undefined,
    pageNo: 1,
    pageSize: 25,
  });

  const { programs, isLoading, error } = usePrograms(params);

  const values = useMemo(() => {
    return {
      programs,
      getProgramsLoading: isLoading,
      getProgramsError: error,
      setParams,
    };
  }, [programs, isLoading, error, setParams]);

  return (
    <ProgramsContext.Provider value={values}>
      {children}
    </ProgramsContext.Provider>
  );
};

export const useProgramContext = () => {
  return useContext(ProgramsContext);
};

export default ProgramsContext;
