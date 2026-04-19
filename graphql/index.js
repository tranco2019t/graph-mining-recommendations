const { Neo4jGraphQL } = require("@neo4j/graphql");
const { ApolloServer } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
const neo4j = require("neo4j-driver");
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");

// Load contents of .env as environment variables
dotenv.config();

// Load GraphQL type definitions from schema.graphql file
const typeDefs = fs
  .readFileSync(path.join(__dirname, "schema.graphql"))
  .toString("utf-8");

// Create Neo4j driver instance
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

// Custom resolver to avoid deprecated APOC helper dependency on Neo4j 5/APOC 5.
const resolvers = {
  Movie: {
    similar: async (source, args) => {
      const session = driver.session({
        database: process.env.NEO4J_DATABASE || undefined,
      });
      try {
        const movieId = source?.movieId ?? null;
        const title = source?.title ?? null;
        const result = await session.run(
          `
          MATCH (m:Movie)
          WHERE
            ($movieId IS NOT NULL AND m.movieId = $movieId) OR
            ($movieId IS NULL AND $title IS NOT NULL AND m.title = $title)
          MATCH (m)-[:ACTED_IN|:DIRECTED|:IN_GENRE]-(overlap)-[:ACTED_IN|:DIRECTED|:IN_GENRE]-(rec:Movie)
          WHERE rec.movieId <> m.movieId
          WITH rec, COUNT(*) AS score
          RETURN rec
          ORDER BY score DESC
          LIMIT $first
          `,
          {
            movieId,
            title,
            first: neo4j.int(args.first ?? 3),
          }
        );

        return result.records.map((record) => {
          const node = record.get("rec");
          return node?.properties ?? null;
        }).filter(Boolean);
      } finally {
        await session.close();
      }
    },
  },
};

// Create executable GraphQL schema from GraphQL type definitions,
// using @neo4j/graphql to autogenerate resolvers
const neoSchema = new Neo4jGraphQL({
  typeDefs,
  driver,
  resolvers,
});

// Create a new Apollo Server instance using our Neo4j GraphQL schema
neoSchema.getSchema().then((schema) => {
  const server = new ApolloServer({
    schema,
    playground: true,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  });
  server.listen().then(({ url }) => {
    console.log(`GraphQL server ready at ${url}`);
  });
});
