const graphql = require('graphql');

const {
  /**  */
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} = graphql;

/**
 * All of the users in our application look like this.
 */
const UserType = new GraphQLObjectType({
  /** The name of the type. */
  name: 'User',
  /** 
   * The fields tells GraphQL about all the different properties that a user has. 
   * The keys of this object are the properties that the user has. 
   */
  fields: {
    /** The id is of type String. */
    id: {type: GraphQLString},
    /** The firstName is of type String. */
    firstName: {type: GraphQLString},
    /** The age is of type String. */
    age: {type: GraphQLInt},
  }
});

/**
 * The root-query is to jump and land on a very specific node in our graph.
 */
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {id: {type: GraphQLString}},
      resolve(parentValue, args) {

      }
    }
  }
});