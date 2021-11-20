require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const RDSDataService = require('aws-sdk/clients/rdsdataservice');
const { User } = require('./User');
const { AWSAuroraDB } = require('./AWSAuroraDB');

class Database{

    constructor(){
        this.databaseProvider = new AWSAuroraDB();
    }

    async testDatabase(){
        this.databaseProvider.testDatabase();
    }

    async createTable(query){
        this.databaseProvider.createTable(query);
    }

    async deleteTable(tableName){
        this.databaseProvider.deleteTable(tableName);
    }

    async createUser(userData){
        return await this.databaseProvider.createUser(userData);
    }

    async deleteUser(userId){
        this.databaseProvider.deleteUser(userId);
    }

    async findOneInTable(tableName, columnName, value){
        // this method should return 1 record or null in the case of not found/error
        return await this.databaseProvider.findOneInTable(tableName, columnName, value);
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