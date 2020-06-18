export default (state, action) => {
  switch (action.type) {
    case "SET_PAGE":
      return {
        ...state,
        page: action.payload
      };
    case "ADD_RECORD":
      delete action.payload.user;
      state.records.unshift(action.payload);
      return {
        ...state,
        records: state.records
      };
    case "DELETE_RECORD":
      return {
        ...state,
        records: state.records.filter(
          record => record.id !== action.payload
        )
      };
    case "SET_RECORDS":
      return {
        ...state,
        records: action.payload
      };
    case "SET_SETTINGS":
      let settings = action.payload;
      settings.notifications = settings.notifications !== undefined ? settings.notifications : [];
      return {
        ...state,
        settings: settings
      };
    default:
      return state;
  }
};
