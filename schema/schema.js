const graphql = require("graphql");
const axios = require("axios");

const {
  /**  */
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  /** GraphQLSchema takes in a root-query and returns a GraphQLSchema instance. */
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      /** The parentValue is the instance of the company we are currently looking at. */
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then((res) => res.data);
      },
    },
  }),
});

/**
 * All of the users in our application look like this.
 */
const UserType = new GraphQLObjectType({
  /** The name of the type. */
  name: "User",
  /**
   * The fields tells GraphQL about all the different properties that a user has.
   * The keys of this object are the properties that the user has.
   */
  fields: () => ({
    /** The id is of type String. */
    id: { type: GraphQLString },
    /** The firstName is of type String. */
    firstName: { type: GraphQLString },
    /** The age is of type String. */
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      /**
       * The parentValue is the value of the user we resolved. With
       * that information, we can now resolve the company.
       *
       * @param {*} parentValue
       * @param {*} args
       * @returns
       */
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then((res) => res.data);
      },
    },
  }),
});

/**
 * The root-query is to jump and land on a very specific node in our graph.
 */
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      /**
       * If the id is passed to the root-query, it will be available inside the resolve function.
       * @param {*} parentValue
       * @param {*} args
       */
      resolve(parentValue, args) {
        /** Fetch the user with the given id. */
        return (
          axios
            .get(`http://localhost:3000/users/${args.id}`)
            /** Axios returns the data wrapped with data-property, we remove the data-property here. */
            .then((res) => res.data)
        );
      },
    },
    company: {
      type: CompanyType,
      /** Whenever someone accesses this field, we expect that the is passed as an argument. */
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then((res) => res.data);
      },
    },
  },
});

/**
 * Create the root-mutation.
 */
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    /** The name of our mutation. */
    addUser: {
      /** The type refers to the type of data, that we return in the resolve-function. */
      type: UserType,
      /** The arguments for the resolve function. The arguments, which we need to create a user. */
      args: {
        /** NonNull means that we have to provide a firstName. */
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        /** NonNull means that we have to provide a age. */
        age: { type: new GraphQLNonNull(GraphQLInt) },
        /** Company can be null. */
        companyId: { type: GraphQLString },
      },
      /**
       * In the resolve function, we undergo the operation to create the user.
       *
       * @param {*} parentValue
       * @param {*} args
       */
      resolve(parentValue, { firstName, age }) {
        return axios
          .post(`http://localhost:3000/users`, {
            firstName,
            age,
          })
          .then((res) => res.data);
      },
    },
    deleteUser: {
      /** The return type. */
      type: UserType,
      /** We need the id to delete the user (GraphQLNonNull). */
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { id }) {
        return axios
          .delete(`http://localhost:3000/users/${id}`)
          .then((res) => res.data);
      },
    },
    editUser: {
      /** The return type. */
      type: UserType,
      args: {
        /** We need the id to update the user. */
        id: { type: new GraphQLNonNull(GraphQLString) },
        /** The firstName, age, companyId are optional */
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios
          .patch(`http://localhost:3000/users/${args.id}`, args)
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
