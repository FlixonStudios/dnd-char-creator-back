const router = require('express').Router();

const {Database} = require('../classes/Database')

let db = new Database();

router.get('/login', async(req, res) => {
    try {
        console.log("login route entered");
        
        let user = db;

        res.status(200).json({message: "connected"});
    } catch(e) {
        console.log(e);
        res.status(400).json({message: "failed to connect"})
    }
})





module.exports = router;