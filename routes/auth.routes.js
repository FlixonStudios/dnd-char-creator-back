const router = require('express').Router();


router.get('/login', async(req, res) => {
    try {
        console.log("login route entered");

        res.status(200).json({message: "connected"});
    } catch(e) {
        console.log(e);
        res.status(400).json({message: "failed to connect"})
    }
})





module.exports = router;