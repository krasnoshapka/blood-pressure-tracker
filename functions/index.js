const functions = require('firebase-functions');
const app = require('express')();

const auth = require('./util/auth');

const { getAllRecords, postRecord, deleteRecord } = require('./api/records');
const { loginUser, signUpUser, userSettings, getUser } = require('./api/users');

// APIs
app.get('/records', auth, getAllRecords);
app.post('/records', auth, postRecord);
app.delete('/records/:record', auth, deleteRecord);

app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/settings', auth, userSettings);
app.get('/user', auth, getUser);

exports.api = functions.https.onRequest(app);
