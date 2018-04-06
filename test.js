var express = require('express');
var graphqlHTTP = require('express-graphql');
var {graphql, buildSchema, GraphQLSchema, GraphQLObjectType} = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
    hello: () => {
        return 'Hello world!';
    },
    quoteOfTheDay: () => {
        return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
    },
    random: () => {
        return Math.random();
    },
    rollThreeDice: () => {
        return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
    },
};

var app = express();
app.use('/graphql',graphqlHTTP({
    schema:schema,
    rootValue:root,
    graphiql:true,
}));
app.listen(4000);
console.log('app running on port:4000');

/*

 paste to console

 var xhr = new XMLHttpRequest();
 xhr.responseType = 'json';
 xhr.open("POST", "/graphql");
 xhr.setRequestHeader("Content-Type", "application/json");
 xhr.setRequestHeader("Accept", "application/json");
 xhr.onload = function () {
 console.log('data returned:', xhr.response);
 }
 xhr.send(JSON.stringify({query: "{ hello }"}));

*/