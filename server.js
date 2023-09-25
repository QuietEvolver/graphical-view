const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');

// define gql schema
const typeDefs = gql`
    type Task {
        id: ID!
        title: String!
        completed: Boolean!
    }
    
    type Query {
        tasks: [Task]
    }

    type Mutation {
        createTask(title: String!): Task
        deleteTask(id: ID!): Task
    }
`;

// define resolvers
const resolvers = {
    Query: {
        tasks: async () => {
            // fetch tasks from database (i.e. MongoDB)
            return Task.Find();
        }, 
    },
    Mutation: {
        createTask: async (_, { title }) => {
            const task = new Task({ title, completed: false });
            await task.save();
            return task;
        }, 
        deleteTask: async (_, { id }) => {
            const task = await Task.findByIdAndRemove(id);
            return task;
        },
    },
};

// set up Apollo server
const server = new ApolloServer({ typeDefs, resolvers });

// connect to MongoDB db
mongoose.connect('mongodb://localhost/taskapp', {
    useNewUrlparser: true,
    useUnifiedTopology: true,
});

const Task = mongoose.model('Task', {
    title: String, 
    completed: Boolean,
}); 

const app = express();
server.applyMiddleware({ app });

// start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});