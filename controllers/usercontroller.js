const router = require('express').Router();
const { UserModel, GigModel, CommentModel } = require('../models');
const { UniqueConstraintError } = require('sequelize/lib/errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validateSession = require('../middleware/validate-session');
const validateRole = require('../middleware/validate-role');

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
            admin: ('User')
            // bio,
            // socialLinks,
            // posts,
        });

        let token = jwt.sign({ id: User.id, role: User.admin, fullName: User.fullName }, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24})

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
                let token = jwt.sign({ id: loginUser.id, role: loginUser.admin, fullName: loginUser.fullName }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24})
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
router.get('/view/:id', async(req, res)=>{
    const { id } = req.params;
    try {
        const thisUser = await UserModel.findOne({
            where: { id: id},
            include: [
                {
                    model: GigModel
                }
            ]
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

// Get all users
router.get('/view', async(req, res)=>{
    try{
        const allUsers = await UserModel.findAll({
            include: [
                {
                    model: GigModel
                }
            ]
        });
        res.status(200).json(allUsers);
    } catch (err) {
        res.status(500).json({
            msg: `Oh no! Server error: ${err}`
        })
    }
})
// update logged in user
router.put('/edit', validateSession, async(req, res)=>{
    try {
        const { firstName, lastName, emailAddress, password, zipCode, instrument, genre, admin, bio, socialLinks } = req.body;

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
            }, {where: {id: req.user.id}
        });
        res.status(200).json({
            msg: `User updated`,
            updatedUser
        });
    } catch (err) {
        res.status(500).json({msg: `Error: ${err}`})
    }
})
// !ADMIN update user by id
router.put('/edit/:id/admin', validateRole, async(req, res)=>{
    const { id } = req.params
    try {
        const { firstName, lastName, emailAddress, password, zipCode, instrument, genre, admin, bio, socialLinks } = req.body;

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
            }, {where: {id: id}
        });
        res.status(200).json({
            msg: `User updated`,
            updatedUser
        });
    } catch (err) {
        res.status(500).json({msg: `Error: ${err}`})
    }
})

// delete by logged in user
router.delete('/delete', validateSession, async(req, res)=>{

    try {
        const deletedComment = await CommentModel.destroy({
            where: { userId: req.user.id }
        });
        const deletedGig = await GigModel.destroy({
            where: { userId: req.user.id }
        });
        const deletedUser = await UserModel.destroy({
            where: { id: req.user.id},
        });
        res.status(200).json({
            msg: `User deleted (sad)`,
            deletedUser: deletedUser,
            deletedGig: deletedGig == 0 ? `no posts to delete` : deletedGig,
            deletedComment: deletedComment == 0? `no comments to delete` : deletedComment,
        })
    } catch (err) {
        res.status(500).json({
            msg: `Error: ${err}`
        })
    }
})
// ! ADMIN delete
router.delete('/delete/:id/admin', validateRole, async(req, res)=>{
    const { id } = req.params;
    
    try {
        const deletedComment = await CommentModel.destroy({
            where: { userId: id }
        });
        const deletedGig = await GigModel.destroy({
            where: { userId: id }
        });
        const deletedUser = await UserModel.destroy({
            where: { id: id},
        });
        res.status(200).json({
            msg: `User deleted (sad)`,
            deletedUser: deletedUser,
            deletedGig: deletedGig == 0 ? `no posts to delete` : deletedGig,
            deletedComment: deletedComment == 0? `no comments to delete` : deletedComment,
        })
    } catch (err) {
        res.status(500).json({
            msg: `Error: ${err}`
        })
    }
})

module.exports = router;