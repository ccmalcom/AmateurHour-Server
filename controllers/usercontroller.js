const router = require('express').Router();
const { UserModel } = require('../models');
const { UniqueConstraintError } = require('sequelize/lib/errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validateSession = require('../middleware/validate-session')

// register user
router.post('/register', async(req, res)=>{
    let { firstName, lastName, emailAddress, password, zipCode, instrument, genre, admin  } = req.body.user;
    try {
        const User = await UserModel.create({
            firstName,
            lastName,
            fullName: (firstName + ' ' + lastName),
            emailAddress,
            password: bcrypt.hashSync(password, 13),
            zipCode,
            instrument,
            genre,
            admin,
            // bio,
            // socialLinks,
            // posts,
        });

        let token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24})

        res.status(201).json({
            msg: 'User successfully registered!',
            user: User,
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError){
            res.status(409).json({
                msg: 'Email already registered! Did you mean to login?'
            });
        } else {
            res.status(500).json({
                msg: `Oh no! Server failed to register user. err=${err}`
            })
        }
    }
});

// login user
router.post('/login', async (req, res) =>{
    let { emailAddress, password } = req.body.user;

    try {
        let loginUser = await UserModel.findOne({
            where: {
                emailAddress: emailAddress,
            },
        });

        if(loginUser) {
            let passwordComparison = await bcrypt.compare(password, loginUser.password);
            if(passwordComparison){
                let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24})
                res.status(200).json({
                    user: loginUser,
                    message: "User successfully logged in!",
                    sessionToken: token
                });
            } else {
                res.status(401).json({
                    msg: 'Incorrect email or password'
                });
            }
        } else {
            res.status(401).json({
                msg: 'Incorrect email or password'
            })
        }
    } catch (err) {
        res.status(500).json({
            msg: 'Failed to log user in.'
        })
    }
});

// Get User by id
router.get('/:id', async(req, res)=>{
    const { id } = req.params;
    try {
        const thisUser = await UserModel.findOne({
            where: { id: id}
        });
        if(thisUser !== null ){
            res.status(200).json(thisUser)
        } else {
            res.status(404).json({ message: 'No such user exists.'})
        }
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

// update user by id (any user can edit any user, bad, don't know how to fix)
router.put('/:id', validateSession, async(req, res)=>{
    try {
        const { firstName, lastName, emailAddress, password, zipCode, instrument, genre, admin, bio, socialLinks, posts } = req.body;

        const updatedUser = await UserModel.update({
            firstName,
            lastName,
            emailAddress,
            password,
            zipCode,
            instrument,
            genre,
            admin,
            bio,
            socialLinks,
            posts}, {where: {id: req.params.id}
        });
        res.status(200).json({
            msg: `User updated`,
            updatedUser
        });
    } catch (err) {
        res.status(500).json({msg: `Error: ${err}`})
    }
})

// delete by user id
// works, but any user can delete any user (bad)
// also, res turns back deletedUser: 1 when deleting user 3. Logged in as user 1.
router.delete('/:id', validateSession, async(req, res)=>{
    const { id } = req.params

    try {
        const deletedUser = await UserModel.destroy({
            where: { id: id}
        });
        res.status(200).json({
            msg: `User deleted (sad)`,
            deletedUser: deletedUser
        })
    } catch (err) {
        res.status(500).json({
            msg: `Error: ${err}`
        })
    }
})

//  user by instrument (don't know how?? should this be in params? body? at all????)
// user by genre (see above)

// Get all users
// ! is not working, no idea why
router.get('/all', async( res)=>{
    try{
        const allUsers = await UserModel.findAll();
        res.status(200).json(allUsers);
    } catch (err) {
        res.status(500).json({
            msg: `Oh no! Server error: ${err}`
        })
    }
})

module.exports = router;