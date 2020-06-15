import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

const initialState = {
  records: null,
  settings: null,
  page: 'pressure'
};

export const GlobalContext = createContext(initialState);
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  function setPage(page) {
    dispatch({
      type: "SET_PAGE",
      payload: page
    });
  }

  function addRecord(record) {
    dispatch({
      type: "ADD_RECORD",
      payload: record
    });
  }

  function deleteRecord(id) {
    dispatch({
      type: "DELETE_RECORD",
      payload: id
    });
  }

  function setRecords(records) {
    dispatch({
      type: "SET_RECORDS",
      payload: records
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        records: state.records,
        user: state.user,
        page: state.page,
        setPage,
        addRecord,
        deleteRecord,
        setRecords
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
