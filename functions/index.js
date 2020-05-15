const functions = require('firebase-functions');
const app = require('express')();

const { getAllRecords, postRecord, deleteRecord } = require('./api/records');

// API
app.get('/records/:user', getAllRecords);
app.post('/records', postRecord);
app.delete('/records/:record', deleteRecord);

exports.api = functions.https.onRequest(app);
