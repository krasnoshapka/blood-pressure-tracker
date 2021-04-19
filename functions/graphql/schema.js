const {gql} = require('apollo-server-express');

const typeDefs = gql`
  scalar Date
  
  enum Weekdays {
    mon
    tue
    wed
    thu
    fri
    sat
    sun
  }

  type User {
    id: ID!
    email: String!
    notifications: [Notification]
    notificationsToken: String
  }
  
  type Notification {
    id: ID!
    user: User!
    days: [Weekdays]!
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
    deleteRecord(id: ID!): Boolean
    
    signInUser(email: String!, password: String!): String
    signUpUser(email: String!, password: String!, confirmPassword: String!): String
    
    addNotification(
      days: [Weekdays]!,
      time: String!
    ): Notification
    deleteNotification(id: ID!): Boolean
  }
  
  type Query {
    user: User
    notifications: [Notification]
    records(start: Date, end: Date): [Record]
  }
`;

module.exports = typeDefs;
