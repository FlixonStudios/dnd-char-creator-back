const router = require('express').Router();
const {Database} = require('../classes/Database')

let db = new Database();

let res = db.getEncryptedPassword("admin");

console.log(res);

router.get('/test', async(req, res) => {
    try {
        console.log("route entered");
        await db.testDatabase();
        res.status(200).json({message: "connected"});
    } catch(e) {
        console.log(e);
        res.status(400).json({message: "failed to connect"})
    }
})

router.post('/create/user-table', async(req, res) => {
    try {
        let query = `CREATE TABLE IF NOT EXISTS 
                        users(
                            id VARCHAR(36) NOT NULL, 
                            username VARCHAR(50) NOT NULL, 
                            password VARCHAR(50) NOT NULL,
                            isAdmin BOOLEAN,
                            PRIMARY KEY(id));`
        
        await db.createTable(query);
        
        res.status(200).json({message: 'Table created successfully.'});
    } catch (e) {
        res.status(400).json({message: e})
    }
});

router.post('/delete/:tableName', async(req,res) => {
    try {        
        await db.deleteTable(req.params.tableName);
        res.status(200).json({message: 'Table deleted successfully.'})
    } catch (e) {
        res.status(400).json({message: e})
    }
});

router.post('/create/user',async(req, res) => {
    try {
        let userData = {
            "username": "admin",
            "password": "admin",            
        }
        
        await db.createUser(userData);
        
        res.status(200).json({message: 'User created successfully.'});
    } catch (e) {
        res.status(400).json({message: e})
    }
})

router.delete('/delete/user/:id', async (req, res) => {
    try {
        let id = req.params.id;

        await db.deleteUser(id);

        res.status(200).json({message: 'User deleted successfully.'});
    } catch (e) {
        res.status(400).json({message: e})
    }
})



module.exports = router;