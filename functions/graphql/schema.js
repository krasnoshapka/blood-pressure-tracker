const {gql} = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    notifications: [Notification]
  }
  
  type Notification {
    id: ID!
    mon: Boolean!
    tue: Boolean!
    wed: Boolean!
    thu: Boolean!
    fri: Boolean!
    sat: Boolean!
    sun: Boolean!
    time: String!
  }  
  
  type Record {
    id: ID!
    user: User!
    sys: Int!
    dia: Int!
    pul: Int!
    datetime: String!
  }
  
  type Mutation {
    addRecord(sys: Int!, dia: Int!, pul: Int!): Record
    deleteRecord(id: ID!): String
  }
  
  type Query {
    user: User
    records(start: String, end: String): [Record]
  }
`;

module.exports = typeDefs;
