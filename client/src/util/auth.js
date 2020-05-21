import {HOME_ROUTE} from "../constants/routes";

export const authMiddleWare = (history) => {
  const authToken = localStorage.getItem('AuthToken');
  if (authToken === null) {
    history.push(`${HOME_ROUTE}/login`);
  }
}
