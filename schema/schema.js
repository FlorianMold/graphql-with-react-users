const graphql = require('graphql');
const axios = require('axios');
const { response } = require('express');

const {
  /**  */
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  /** GraphQLSchema takes in a root-query and returns a GraphQLSchema instance. */
  GraphQLSchema,
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
      /**
       * If the id is passed to the root-query, it will be available inside the resolve function.
       * @param {*} parentValue 
       * @param {*} args 
       */
      resolve(parentValue, args) {
        console.log(parentValue)
        /** Fetch the user with the given id. */
        return axios.get(`http://localhost:3000/users/${args.id}`)
        /** Axios returns the data wrapped with data-property, we remove the data-property here. */
        .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});