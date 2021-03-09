
const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const resolverFunctions = {
  Query: {
    books: () => books,
  },
};

module.exports = resolverFunctions;
