const { admin, db, firebase } = require('../util/firebase');

const { validateLoginData, validateSignUpData } = require('../util/validators');

// Login
exports.loginUser = (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password
  };

  const { valid, errors } = validateLoginData(user);
  if (!valid) return response.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return response.json({ token });
    })
    .catch((error) => {
      console.error(error);
      return response.status(403).json({ general: 'wrong credentials, please try again'});
    });
};

// Signup user
exports.signUpUser = (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
  };

  const { valid, errors } = validateSignUpData(newUser);

  if (!valid) return response.status(400).json(errors);

  let token, userId;
  db
    .collection('users')
    .where('email', '==', newUser.email)
    .get()
    .then((data) => {
      if (data._size > 0) {
        return response.status(400).json({ email: 'this email is already registered' });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(
            newUser.email,
            newUser.password
          );
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idtoken) => {
      token = idtoken;
      const userCredentials = {
        email: newUser.email
      };
      return db
        .doc(`/users/${userId}`)
        .set(userCredentials);
    })
    .then(()=>{
      return response.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return response.status(400).json({ email: 'Email already in use' });
      } else {
        return response.status(500).json({ general: 'Something went wrong, please try again' });
      }
    });
}

// Change user settings
exports.userSettings = (request, response) => {
  const userSettings = {
    email: request.body.email,
    notificationsToken: request.body.notificationsToken ? request.body.notificationsToken : '',
    notifications: request.body.notifications ? request.body.notifications : []
  };

  // TODO: Implement settings validation
  // const { valid, errors } = validateSignUpData(userSettings);

  // if (!valid) return response.status(400).json(errors);

  db
    .doc(`/users/${request.user.uid}`)
    .update(userSettings)
    .then(() => {
      return response.json({ message: 'Settings updated successfully' });
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};

exports.getUser = (request, response) => {
  let userData = {};
  db
    .doc(`/users/${request.user.uid}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData = doc.data();
        return response.json(userData);
      }
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
}
