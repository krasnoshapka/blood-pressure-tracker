const app = require('express')();
const {ApolloServer} = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  // Enable graphiql gui
  introspection: true,
  playground: true
});

apolloServer.applyMiddleware({app, path: '/', cors: true});

module.exports = app;
