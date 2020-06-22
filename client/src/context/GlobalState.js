// TODO: This is global context provider. It should be refactored into separate context providers for each group of data.

import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

const initialState = {
  records: null,
  settings: {
    email: '',
    settings: []
  },
  page: 'pressure'
};

export const GlobalContext = createContext(initialState);
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  function actionCreator(type) {
    return (payload) => {
      dispatch({
        type: type,
        payload: payload
      });
    }
  }

  const setPage = actionCreator("SET_PAGE");
  const addRecord = actionCreator("ADD_RECORD");
  const deleteRecord = actionCreator("DELETE_RECORD");
  const setRecords = actionCreator("SET_RECORDS");
  const setSettings = actionCreator("SET_SETTINGS");

  return (
    <GlobalContext.Provider
      value={{
        records: state.records,
        settings: state.settings,
        page: state.page,
        setPage,
        addRecord,
        deleteRecord,
        setRecords,
        setSettings
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
