// TODO: This is global context provider. It should be refactored into separate context providers for each group of data.

import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

let currentDate = new Date();
currentDate.setMonth(currentDate.getMonth() - 1);

const initialState = {
  records: null,
  filters: {
    start: currentDate.toISOString().slice(0,10),
    end: (new Date()).toISOString().slice(0,10)
  },
  settings: {
    email: '',
    notifications: [],
    notificationsToken: ''
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

  const setFilters = (filters, loadRecords) => {
    // Callback for loading records is called here in order to load them on filters change.
    if (typeof loadRecords == 'function') {
      loadRecords(filters);
    }
    dispatch({
      type: "SET_FILTERS",
      payload: filters
    });
  };

  const setPage = actionCreator("SET_PAGE");
  const addRecord = actionCreator("ADD_RECORD");
  const deleteRecord = actionCreator("DELETE_RECORD");
  const setRecords = actionCreator("SET_RECORDS");
  const setSettings = actionCreator("SET_SETTINGS");

  return (
    <GlobalContext.Provider
      value={{
        records: state.records,
        filters: state.filters,
        settings: state.settings,
        page: state.page,
        setPage,
        addRecord,
        deleteRecord,
        setFilters,
        setRecords,
        setSettings
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
