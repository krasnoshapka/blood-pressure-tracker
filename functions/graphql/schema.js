const {gql} = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

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
    datetime: Date!
  }
  
  type Mutation {
    addRecord(sys: Int!, dia: Int!, pul: Int!): Record
    deleteRecord(id: ID!): String
    
    signInUser(email: String!, password: String!): String
    signUpUser(email: String!, password: String!, confirmPassword: String!): String
  }
  
  type Query {
    user: User
    records(start: Date, end: Date): [Record]
  }
`;

module.exports = typeDefs;
