require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const RDSDataService = require('aws-sdk/clients/rdsdataservice');
const { User } = require('./User');
const DEFAULT_QUERY = 'SELECT 1';

class AWSAuroraDB{
    
    constructor(){
        this.databaseName = 'dndcharcreatordb';
        this.userTableName = 'users';        
    }

    async testDatabase(){
        const rdsdataservice = this.instantiateRDSObject();
    
        const params = this.instantiateDefaultParams(DEFAULT_QUERY);
        
        rdsdataservice.executeStatement(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
            } else {
                console.log(JSON.stringify(data, null, 2));
            }
        })
    }
    
    async createTable(query){        
        const rdsdataservice = this.instantiateRDSObject();    
        
        const params = this.instantiateDefaultParams(query);   
    
        rdsdataservice.executeStatement(params, (err, data) => {        
            if (err) {
                console.log(err, err.stack);          
            } else {
                console.log(JSON.stringify(data, null, 2));
            }         
        });    
        
    }
    
    async deleteTable(tableName){
        const rdsdataservice = this.instantiateRDSObject();
    
        let query = `DROP TABLE IF EXISTS ${tableName}`;
    
        const params = this.instantiateDefaultParams(query);
    
        rdsdataservice.executeStatement(params, (err, data) => {    
            if (err) {
                console.log(err, err.stack);          
            } else {
                console.log(JSON.stringify(data, null, 2));
            }                  
        });
    }
    
    async createUser(userData){
        const rdsdataservice = this.instantiateRDSObject();    
        
        let user = new User(userData.username, userData.password);    
    
        if (!user.checkValidity){
            console.log("Invalid User");
            return;
        }
   

        let userId = uuidv4();
        console.log(user);
        console.log(userId);

        //(${userTableHeaders.id}, ${userTableHeaders.username}, ${userTableHeaders.password}, ${userTableHeaders.isAdmin})

        let query = `INSERT INTO ${this.userTableName}(id, username, password, isAdmin) ` + 
        `VALUES ("${userId}", "${user.username}", "${user.password}", ${user.isAdmin});`;
        
        console.log(query);

        const params = this.instantiateDefaultParams(query);
    
        rdsdataservice.executeStatement(params, (err, data) => {    
            if (err) {
                console.log(err, err.stack);          
            } else {
                console.log(JSON.stringify(data, null, 2));
            }                  
        });
    }
    
    instantiateDefaultParams(query = DEFAULT_QUERY){
        return {
            resourceArn: process.env.DATABASE_ARN,
            secretArn: process.env.SECRET_ARN,
            database: 'dndcharcreatordb',
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
}

module.exports = { AWSAuroraDB };