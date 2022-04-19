const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let User = require("../models/user.model");


function generateAccessToken(id, username) {
    return jwt.sign({ id, username }, process.env.TOKEN_SECRET, {
        expiresIn: "3600s"
    });
}


router.route("/register").post((req, res) => {
    const { username, password } = req.body;

    if( !password || !username ) {
        return res.status(400).json({msg: "Please enter a username and password"});
    }

    const newUser = new User({ username, password});
    User.findOne({ username: username }, (err, user) => {
        if(user) {
            res.send({message: "User already exists"});
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err,hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save().then((user) =>{
                        const token = generateAccessToken(user.id, user.username);
                        res.json({
                            token,
                            user
                        });
                    })
                });
            });
        }
    });

});

router.route("/login").post((req, res) => {
    const { username, password } = req.body;

    if(!password || !username) {
        return res.status(400).json({ msg: "Pleaes enter a valid username/password."});
    }

    User.findOne({ username: username.toLowerCase() }, (err, user) => {
        if(user) {
            bcrypt.compare(password, user.password).then((IsMatch) => {
                if(!IsMatch)
                    return res.status(400).json({ msg: "Invalid Password"});
                
                const token = generateAccessToken(user.id, user.username);

                res.json({
                    token,
                    user
                });
            });
        }
    });

});

module.exports = router;