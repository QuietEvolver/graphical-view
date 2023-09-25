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
`