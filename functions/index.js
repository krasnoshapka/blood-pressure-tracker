const functions = require('firebase-functions');
const app = require('express')();

const { getAllRecords, postAddRecord } = require('./api/records');

// API
app.get('/records/:user', getAllRecords);
app.post('/records', postAddRecord);

exports.api = functions.https.onRequest(app);
