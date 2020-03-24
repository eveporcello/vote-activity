const {
  ApolloServer,
  gql,
  PubSub
} = require("apollo-server");

const pubsub = new PubSub();

let tabs = 0,
  spaces = 0;

const typeDefs = gql`
  enum Style {
    TABS
    SPACES
  }

  type Results {
    tabs: Int!
    spaces: Int!
  }

  type Query {
    results: Results!
    totalVotes: Int!
  }

  type Mutation {
    vote(style: Style!): String!
  }

  type Subscription {
    results: Results!
  }
`;

const resolvers = {
  Query: {
    results: () => ({ tabs, spaces }),
    totalVotes: () => tabs + spaces
  },
  Mutation: {
    vote(parent, { style }, { pubsub }) {
      const inc = 1;
      if (style === "TABS") tabs += inc;
      else spaces += inc;

      pubsub.publish("vote-recorded", {
        results: { tabs, spaces }
      });

      return "Thank you for voting!";
    }
  },
  Subscription: {
    results: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator("vote-recorded")
    }
  }
};

const context = { pubsub };

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context
});

server
  .listen()
  .then(({ url }) =>
    console.log(`Server running on port ${url}`)
  );
