// const graphql = require('graphql');
//
// const {GraphQLObjectType, GraphQLString, GraphQLSchema} = graphql;
//
// const UserType = new GraphQLObjectType({
//   name: 'User',
//   fields: () => ({
//     id: {type: GraphQLString},
//     email: {type: GraphQLString}
//   })
// });
//
// const RootQuery = new GraphQLObjectType({
//   name: 'RootQueryType',
//   fields: {
//     user: {
//       type: UserType,
//       args: {id: {type: GraphQLString}},
//       resolve(parent, args) {
//         return {
//           id: '123123123',
//           email: 'shlapa@gmail.com'
//         }
//       }
//     }
//   }
// });
//
// module.exports = new GraphQLSchema({
//   query: RootQuery
// });

const {gql} = require('apollo-server-express');

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

module.exports = typeDefs;
