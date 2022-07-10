const express = require('express');
/** The GraphQL Layer of the application. */
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

/** 
 * Route the requests for /graphql to the graphql handler.
 */
app.use('/graphql', graphqlHTTP({
  /** graphiql should only be used in a development environment */
  graphiql: true,
  schema
}));

/** 
 * Setting up our application to listen to port 4000.
 */
app.listen(4000, () => {
  console.log('Listening');
});