require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const RDSDataService = require('aws-sdk/clients/rdsdataservice');
const { User } = require('./User');
const { AWSAuroraDB } = require('./AWSAuroraDB');

class Database{

    constructor(){
        this.databaseProvider = new AWSAuroraDB();
    }

    testDatabase(){
        this.databaseProvider.testDatabase();
    }

    createTable(query){
        this.databaseProvider.createTable(query);
    }

    deleteTable(tableName){
        this.databaseProvider.deleteTable(tableName);
    }

    createUser(userData){
        this.databaseProvider.createUser(userData);
    }
    
}



module.exports = { Database };