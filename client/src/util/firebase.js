import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCiuw3H3gukg77feI03_6_GJHBZEPXc8k4",
  authDomain: "blood-pressure-tracker-77c8c.firebaseapp.com",
  databaseURL: "https://blood-pressure-tracker-77c8c.firebaseio.com",
  projectId: "blood-pressure-tracker-77c8c",
  storageBucket: "blood-pressure-tracker-77c8c.appspot.com",
  messagingSenderId: "466775194306",
  appId: "1:466775194306:web:7771355adc7f71d05e195b"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.usePublicVapidKey("BF8EdjW15idz90wX-hX1vExMmBmIdT-EIkmEoZxh7CiX4N5Ih4NVkjsWHpuYb5TCp4qgeyvxsYRluT5R030c-lA");

// Callback fired if Instance ID token is updated.
messaging.onTokenRefresh(() => {
  messaging.getToken().then((refreshedToken) => {
    console.log('Token refreshed.');
    // TODO: update refreshed token on the server.
  }).catch((err) => {
    console.log('Unable to retrieve refreshed token ', err);
  });
});

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.setBackgroundMessageHandler` handler.
messaging.onMessage((payload) => {
  console.log('Message received. ', payload);
  // TODO: handle push notification.
});

export default messaging;
