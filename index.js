var express = require('express');
var graphqlHTTP = require('express-graphql');
var fs = require('fs');
var {graphql, GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLList} = require('graphql');

var {callQuery,callMutation} = require('./call');
var users = require('./data');

var userType = new GraphQLObjectType({
    name:'User',
    fields:()=>({
        id:{ type: new GraphQLNonNull(GraphQLString) },
        name:{ type: GraphQLString },
        age:{ type: GraphQLInt }
    })
});

var query = new GraphQLObjectType({
    name:'Query',
    fields:{
        user:{
            type: userType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: (root,args)=>{
                // DB(select id == id) -> return user

                var id = args.id;
                var user = users.find((user)=>{if(user.id === id) return user});

                if(user == null) throw new Error('no user exists with id ' + id);
                console.log('GET USER ID : '+JSON.stringify(user));

                return user;
            }
        },
        allUser:{
            type: new GraphQLList(userType),
            resolve: ()=>{
                return users
            }
        }
    }
});

var mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        createUser: {
            type: userType, //createUser에서 나오는 결과
            args: {
                id:{ type: GraphQLString },
                name:{ type: GraphQLString },
                age:{ type: GraphQLInt }
            },
            resolve: (obj,args)=>{
                var {name,age,id} = args;

                //add to user in DB
                var users = JSON.parse(fs.readFileSync('data.json').toString());
                users.push({name,age,id});
                fs.writeFile('data.json', JSON.stringify(users));
                return {name,age,id};
            }
        }
    }
});

var schema = new GraphQLSchema({
    query: query,
    mutation: mutation,
});

var app = express();
app.use('/graphql',graphqlHTTP({
    schema:schema,
    pretty:true,
    graphiql:true,
}));
app.listen(4000);
console.log('app running on port:4000');

var query = `{
    allUser {
        name
        age
    }
}`

var mutation = `mutation($id:String, $name:String, $age:Int) {
  createUser(id:$id, name:$name, age:$age) {
    id
    age
    name
  }
}`

var variables = (id,name,age) => {
    return {
        id,name,age
    }
}

callQuery('http://localhost:4000/graphql',query);
callMutation('http://localhost:4000/graphql',mutation, variables("1","Kim",32));
