import React, { createContext, useContext } from "react";
import {gql, useMutation, useQuery} from "@apollo/client";
import messaging from "../util/firebase";
import {processErrors} from "../util/errors";
import {weekDays} from "../constants/notification";

const USER_QUERY = gql`
  {
    user {
      email
      notifications {
        id
        days
        time
      }
    } 
  }
`;

const ADD_NOTIFICATION_MUTATION = gql`
  mutation addNotification(
    $days: [Weekdays]!,
    $time: String!
  ) {
    addNotification(days: $days, time:$time) {
      id
    }
  }
`;

const DELETE_NOTIFICATION_MUTATION = gql`
  mutation deleteNotification($id: ID!){
    deleteNotification(id: $id)
  }
`;

const UserContext = createContext({
  email: '',
  notifications: [],
  notificationsToken: ''
});

const UserProvider = props => {
  const { loading, data, refetch, error: _userError } = useQuery(USER_QUERY);
  let user = data ? {...data.user} : null;
  const [addNotification, {error: _addNotificationError}] = useMutation(ADD_NOTIFICATION_MUTATION);
  const [deleteNotification, {error: _deleteNotificationError}] = useMutation(DELETE_NOTIFICATION_MUTATION);

  const startNotification = async () => {
    if (user && !user.notifications.length) {
      try {
        await messaging.requestPermission();
        const notificationsToken = await messaging.getToken();
        // TODO: Save notificationsToken in user settings
      } catch (err) {
        // TODO: Better notify user to accept notification permission.
        console.log(err);
        return false;
      }
    }

    return true;
  }

  const _addNotification = async (notitification) => {
    const days = [];
    weekDays.forEach((day) => {
      if (notitification[day.name]) {
        days.push(day.name);
      }
    });

    try {
      const res = await addNotification({ variables: { days, time: notitification.time } });
      if (res && res.data && res.data.addNotification) {
        await refetch();
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  }

  const _deleteNotification = async (id) => {
    try {
      const res = await deleteNotification({ variables: { id } });
      if (res && res.data && res.data.deleteNotification) {
        await refetch();
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  }

  if (user && user.notifications) {
    user.notifications = user.notifications.map((n) => {
      const res = {...n};
      if (n.days) {
        weekDays.forEach((day) => {
          res[day.name] = n.days.includes(day.name);
        });
      }
      return res;
    });
  }

  const error = processErrors(_userError) || processErrors(_addNotificationError) ||
    processErrors(_deleteNotificationError);
  return <UserContext.Provider value={{loading, error, user, startNotification,
    addNotification: _addNotification, deleteNotification: _deleteNotification}} {...props} />;
}

const useUser = () => useContext(UserContext);

export { UserProvider, useUser };
