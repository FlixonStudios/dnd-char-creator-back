const router = require('express').Router();
const { Database } = require('../classes/Database');


let db = new Database();

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
                            id VARCHAR(36) NOT NULL UNIQUE, 
                            username VARCHAR(50) NOT NULL UNIQUE, 
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
            "username": req.body.username,
            "password": req.body.password,          
        }
        
        let result = await db.createUser(userData);
        
        res.status(200).json({result});
    } catch (e) {
        res.status(400).json({result});
    }
})


// findOne route is only for testing, it will not be exposed
router.get('/find/:group/:name/:value', async(req, res) => {
    try {        
        let { group, name, value } = req.params;

        let result = await db.findOneInTable(group, name, value);
        // if result.record = 0, means record does not exist in table.
        console.log('>>>>', result);

        if (result.length === 0) {
            throw "Record not found";
        }



        res.status(200).json({message: 'Record found'})
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