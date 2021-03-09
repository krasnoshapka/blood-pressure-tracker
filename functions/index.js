const functions = require('firebase-functions');
const rest = require('./rest');
const graphql = require('./graphql');

module.exports.api = functions.https.onRequest(rest);
module.exports.graphql = functions.https.onRequest(graphql);
