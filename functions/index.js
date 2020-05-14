const functions = require('firebase-functions');
const app = require('express')();

const { getAllRecords } = require('./api/records');

app.get('/records/:user', getAllRecords);
exports.api = functions.https.onRequest(app);
