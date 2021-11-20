require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const RDSDataService = require('aws-sdk/clients/rdsdataservice');
const { User } = require('./User');
const DEFAULT_QUERY = 'SELECT 1';

class AWSAuroraDB{
    
    constructor(){
        this.databaseName = 'FlixonStudiosDB';
        this.userTableName = 'users';
        this.rdsdataservice = this.instantiateRDSObject();       
    }

    async testDatabase(){
        
        const params = this.instantiateDefaultParams(DEFAULT_QUERY);
        
        params['continueAfterTimeout'] = true;

        this.rdsdataservice.executeStatement(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
            } else {
                console.log(JSON.stringify(data, null, 2));
            }
        })
    }
    
    async createTable(query){        
                
        const params = this.instantiateDefaultParams(query);   
    
        this.rdsdataservice.executeStatement(params, (err, data) => {        
            if (err) {
                console.log(err, err.stack);          
            } else {
                console.log(JSON.stringify(data, null, 2));
            }         
        });    
        
    }
    
    async deleteTable(tableName){
            
        let query = `DROP TABLE IF EXISTS ${tableName}`;
    
        const params = this.instantiateDefaultParams(query);
    
        this.rdsdataservice.executeStatement(params, (err, data) => {    
            if (err) {
                console.log(err, err.stack);          
            } else {
                console.log(JSON.stringify(data, null, 2));
            }                  
        });
    }
    
    async createUser(userData){
                
        let user = new User(userData.username, userData.password);    
    
        if (!user.checkValidity){
            console.log("Invalid User");
            return;
        }

        let userId = uuidv4();

        let query = `INSERT IGNORE INTO ${this.userTableName}(id, username, password, isAdmin) ` + 
        `VALUES ("${userId}", "${user.username}", "${user.password}", ${user.isAdmin});`;
               
        const params = this.instantiateDefaultParams(query);
        
        try {
            this.rdsdataservice.executeStatement(params, (err, data) => {    
                if (err) {
                    console.log(err, err.stack);
                } else {
                    // not refactored as there may be different error handling per method
                    console.log(JSON.stringify(data, null, 2));
                }                  
            });    
        } catch (error) {
            console("catch block entered");
            return error;
        }

        
    }

    async deleteUser(userId){
        
        let query = `DELETE FROM ${this.userTableName} WHERE id="${userId}";`;

        const params = this.instantiateDefaultParams(query);
    
        this.rdsdataservice.executeStatement(params, (err, data) => {    
            if (err) {
                console.log(err, err.stack);          
            } else {
                console.log(JSON.stringify(data, null, 2));
            }                  
        });
    }

    async findOneInTable(tableName, columnName, value){
        // find one should return 1 or 0 record at most
        let query = `SELECT * FROM ${tableName} WHERE ${columnName} LIKE "${value}";`;
        const params = this.instantiateDefaultParams(query);
        
        try {
            
            let { records } = await this.rdsdataservice.executeStatement(params).promise();
            
            return records;
        } catch (error) {
            console.log(error);
            return null;
        };
    }

    
    instantiateDefaultParams(query = DEFAULT_QUERY){
        return {
            resourceArn: process.env.DATABASE_ARN,
            secretArn: process.env.SECRET_ARN,
            database: this.databaseName,
            sql: query,
        }
    }
    
    instantiateRDSObject(){
        return new RDSDataService({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretKeyId: process.env.AWS_SECRET_ACCESS_KEY,
            apiVersion: '2018-08-01',
            region: process.env.REGION
        });
    }

    async encryptPassword(plainTextPassword){
        try {
            const saltRounds = 10;

            let salt = await bcrypt.genSalt(saltRounds);
            let encryptedPassword = await bcrypt.hash(plainTextPassword, salt)    
            
            return encryptedPassword;
        } catch (error) {
            console.log(error);
            return "";
        };
    }

    async checkPassword(plainTextPassword, hashedPassword = ""){
        try {
            //console.log(`inputPass: ${plainTextPassword} | hashPass: ${hashedPassword}`)
            let res = await bcrypt.compare(plainTextPassword, hashedPassword);
            //console.log(`Password match: ${res}`)
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = { AWSAuroraDB };