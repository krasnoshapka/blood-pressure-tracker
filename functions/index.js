const functions = require('firebase-functions');
const app = require('express')();

const auth = require('./util/auth');

const { getAllRecords, postRecord, deleteRecord } = require('./api/records');
const { loginUser, signUpUser, userSettings } = require('./api/users');

// APIs
app.get('/records/:user', getAllRecords);
app.post('/records', postRecord);
app.delete('/records/:record', deleteRecord);

app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/settings', auth, userSettings);

exports.api = functions.https.onRequest(app);
