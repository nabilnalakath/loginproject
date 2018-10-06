var express = require('express');
var router = express.Router();
var uuid = require('uuid');



const User = require('../models/user');


const findToken = (req, res, next) => {
    const token = req.body.token;
    User.findOne({
        'tokens.token': token,
        'tokens.isExpired': false
    }).then(user => {
        if (!user) return res.send({ status: 0, message: "unauthorized" })
        req.user = user;
        req.token = token;
        next()
    }).catch(err => {
        res.send({ status: 0, message: "unauthorized" })
    })
}



router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;


    User.getUserByUsername(username, function (err, user) {
        if (err) throw err;
        if (!user) {
            return res.send({ status: 0, message: "No user found" })
        }

        User.comparePassword(password, user.password, function (err, isMatch) {
            if (err) return done(err);
            if (isMatch) {
                var token = uuid();
                console.log(token);
                User.findOneAndUpdate({
                    username,
                }, {
                        $push: {
                            tokens: {
                                token,
                            }
                        }
                    }).then(user => {
                        res.send({
                            status: 1,
                            message: "Login Successful",
                            token
                        })
                    }).catch(err => {
                        console.log(err);
                    })
            } else {
                return res.send({ status: 0, message: "Password incorrect" })
            }
        });
    });
})


router.post('/logout', findToken, (req, res) => {

    User.findOneAndUpdate({ '_id': req.user._id, 'tokens.token': req.token }, {
        $set: {
            'tokens.$.isExpired': true
        }
    }).then(() => {
        res.send({ status: 1, message: "user logged out" })
    }).catch(err => {
        console.log(err);
    })
})


router.post('/admin', findToken, (req, res) => {
    if (req.user.usertype == "admin") {
        res.send({
            status: 1, message: "user is admin", details:
                [
                    { type: "admin", value: 10 },
                    { type: "sales", value: 100 },
                    { type: "accounts", value: 200 }
                ]
        })
    } else {
        res.send({
            status: 2, message: "user does not have admin privilage"
        })
    }
})
router.post('/sales', findToken, (req, res) => {
    if (req.user.usertype == "admin" || req.user.usertype == "sales") {
        res.send({
            status: 1, message: `user is ${req.user.usertype}`, details:
                [

                    { type: "sales", value: 100 },

                ]
        })
    } else {
        res.send({
            status: 2, message: "user does not have sales privilage"
        })
    }
})

router.post('/accounts', findToken, (req, res) => {
    if (req.user.usertype == "admin" || req.user.usertype == "accounts") {
        res.send({
            status: 1, message: `user is ${req.user.usertype}`, details:
                [

                    { type: "accounts", value: 200 },

                ]
        })
    } else {
        res.send({
            status: 2, message: "user does not have accounts privilage"
        })
    }
})


module.exports = router;
