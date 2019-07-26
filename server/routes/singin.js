const express = require('express');
const loginRoutes = express.Router();

//import User model object
let User = require('../models/User');
//import UserSession model object
let UserSession = require('../models/UserSession');

//Sign up
loginRoutes.route('/signup').post((req, res) => {
    const { body } = req;
    const { password } = body;
    let { email } = body;
    //admin
    let { admin } = body;

    if (!email){
            return res.send({
                success: false,
                message: 'Error: Email cannot be blank'
            });
    }
    if (!password){
            return res.send({
                success: false,
                message: 'Error: Password cannot be blank'
            });
    }

    email = email.trim().toLowerCase();

    //Verify email doesnt exist
    //save
    User.find({
            email: email
    }, (err, previousUsers) =>{
        if (err){
                return res.send({
                    success: false,
                    message: 'Error: Server error'
            });
        } else if (previousUsers.length > 0){
                return res.send({
                    success: false,
                    message: 'Error: Account already exists'
            });
        }

        //save the new user
        const newUser = new User();

        newUser.email = email;
        newUser.admin = admin;
        newUser.password = newUser.generateHash(password);
        newUser.save((err, user)=>{
            if (err){
                return res.send({
                        success: false,
                        message: 'Error: Server error'
                });
            }
            return res.send({
                    success: true,
                    message: 'Signed up'
            });
        });
    });
});//end of signup endpoint

//----------------------------------------------------------------------------
//signupEndpoint2
loginRoutes.route('/signup2').post((req, res)=> {
    let users = new User(req.body);
    users.save()
        .then(users => {
            res.status(200).json({'users': 'user signup successfull'});
        })
        .catch(err => {
            res.status(400).send('unable to sign user', err);
        })
});
//Get all data route
loginRoutes.route('/').get((req, res)=>{
    User.find((err, users) => {
        if(err){
            console.log(err);
        } else {
            res.json(users);
        }
    })
});

// user details route
loginRoutes.route('/user/:id').get((req, res) => {
    let id= req.params.id;
    User.findById(id, (err, users) => {
        res.json(users);
    });
});
//-------------------------------------------------
//signin endpoint
loginRoutes.route('/signin').post((req, res)=> {
    const { body } = req;
        const { password } = body;
        let { email } = body;

        if (!email){
            return res.send({
                success: false,
                message: 'Error: Email cannot be blank'
            });
        }
        if (!password){
            return res.send({
                success: false,
                message: 'Error: Password cannot be blank'
            })
        }

        email = email.trim().toLowerCase();

        User.find({
            email: email
        }, (err, users) => {
            if (err){
                console.log('err 2:', err);
                return res.send({
                    success: false,
                    message: 'Error: server error'
                });
            }
            if (users.length != 1){
                return res.send({
                    success: false,
                    message: 'Error: Invalid'
                });
            }

            const user = users[0];
            if (!user.validPassword(password)){
                return res.send({
                    success: false,
                    message: 'Error: Invalid'
                });
            }

            //otherwise correct user
            const userSession = new UserSession();
            userSession.userId = user._id;
            userSession.save((err, doc) => {
                if (err){
                    console.log(err);
                    return res.send({
                        success: false,
                        message: 'Error: server error'
                    });
                }

                return res.send({
                    success: true,
                    message: 'Valid Sign in',
                    token: doc._id
                });
            })
        })
}); //end signin endpoint

//logout endpoint
loginRoutes.route('/logout').get((req, res)=>{
    //get token
    const { query } = req;
    const { token } = query;

    //verify token authenticity and its not deleted
    UserSession.findOneAndUpdate({
        _id: token,
        isDeleted: false
    }, {
        $set: {
            isDeleted: true
        }
    }, null, (err, sessions) => {
        if (err){
            console.log(err);
            return res.send({
                success: false,
                message: 'Error: Server error'
            });
        }

        return res.send({
            success: true,
            message: 'Logout successful'
        });
    })
})//end logout endpoint

loginRoutes.route('/verify').get((req, res)=>{
    //get token
    const { query } = req;
    const { token } = query;

    // Verify the token is one of a kind and it's not deleted.
    UserSession.find({
        _id: token,
        isDeleted: false
    }, (err, sessions) => {
        if (err) {
        console.log(err);
        return res.send({
            success: false,
            message: 'Error: Server error'
        });
        }
        if (sessions.length != 1) {
        return res.send({
            success: false,
            message: 'Error: Invalid'
        });
        } else {
        // DO ACTION
        return res.send({
            success: true,
            message: 'Good'
        });
        }
  });
})

module.exports = loginRoutes;