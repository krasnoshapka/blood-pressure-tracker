const app = require('express')();
const {ApolloServer} = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { admin, db } = require('../util/admin');

async function authContext(req) {
  let token = '';
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token found');
    throw new Error('Unauthorized');
  }
  let doc;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    doc = await db.doc(`/users/${decodedToken.uid}`).get();
  } catch (e) {
    throw new Error(e.message);
  }
  if (doc.exists) {
    return {
      uid: doc.id,
      email: doc.data().email
    }
  } else {
    console.error('User not found');
    throw new Error('Unauthorized');
  }
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => authContext(req),
  // Enable graphiql gui
  introspection: true,
  playground: true
});

apolloServer.applyMiddleware({app, path: '/', cors: true});

module.exports = app;
