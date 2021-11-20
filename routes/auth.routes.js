const router = require('express').Router();

const {Database} = require('../classes/Database')
const { DB } = require('../constants/enums');

let db = new Database();

router.post('/login', async(req, res) => {
    try {
        console.log("login route entered");
        
        let userData = {
            "username": req.body.username,
            "password": req.body.password,          
        }

        console.log(">>>>", DB.USERS.NAME, DB.USERS.COL_USERNAME, userData.username)

        let user = await db.findOneInTable(DB.USERS.NAME, DB.USERS.COL_USERNAME, userData.username);
        
        console.log('>>>>user', user)

        res.status(200).json({message: "connected"});
    } catch(e) {
        console.log(e);
        res.status(400).json({message: "failed to connect"})
    }
})





module.exports = router;