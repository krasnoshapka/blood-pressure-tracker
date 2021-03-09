const app = require('express')();
const auth = require('../util/auth');

// REST API
const { getAllRecords, postRecord, deleteRecord } = require('./records');
const { loginUser, signUpUser, userSettings, getUser } = require('./users');

app.get('/records', auth, getAllRecords);
app.post('/records', auth, postRecord);
app.delete('/records/:record', auth, deleteRecord);

app.post('/user/login', loginUser);
app.post('/user/signup', signUpUser);
app.post('/user/settings', auth, userSettings);
app.get('/user', auth, getUser);

module.exports = app;
