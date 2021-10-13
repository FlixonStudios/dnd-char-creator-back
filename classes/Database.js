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
        return this.databaseProvider.createUser(userData);
    }

    deleteUser(userId){
        this.databaseProvider.deleteUser(userId);
    }

    findOneInTable(tableName, columnName, value){
        return this.databaseProvider.findOneInTable(tableName, columnName, value);
    }

    // // to remove
    // async getEncryptedPassword(password){
    //     return await this.databaseProvider.encryptPassword(password);
    // }
    // // to remove
    // async checkEncryptedPassword(password, hashedPassword){
    //     return await this.databaseProvider.checkPassword(password, hashedPassword);
    // }

}



module.exports = { Database };