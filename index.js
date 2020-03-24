const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    build: String!
  }
`;

const resolvers = {
  Query: {
    build: () => "Build Something Cool!"
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server
  .listen()
  .then(({ url }) =>
    console.log(`Server running on port ${url}`)
  );
