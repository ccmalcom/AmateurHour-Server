const router = require('express').Router();
const { GigModel, CommentModel } = require('../models');
const validateSession = require('../middleware/validate-session');
const validateRole = require('../middleware/validate-role');

// create post
router.post('/new', validateSession, async (req, res) => {
    let { location, title, instrument, genre, size, content } = req.body
    let { id, fullName } = req.user

    try {
        const Gig = await GigModel.create({
            location,
            title,
            instrument,
            genre,
            size,
            content,
            userId: id,
            posterName: fullName
        });
        res.status(200).json({
            msg: 'Gig posted! Woo hoo!',
            Gig
        })
    } catch (err) {
        res.status(500).json({
            msg: `Oh no, server error: ${err}`
        })
    }
})

// view post by id
router.get('/view/:gigId', validateSession, async (req, res) => {
    const { gigId } = req.params;
    try {
        const thisGig = await GigModel.findOne({
            where: { id: gigId },
            include: [{ model: CommentModel }]
        });
        res.status(200).json({ thisGig })
    } catch (err) {
        res.status(500).json({ msg: `Oh no, server error: ${err}` })
    }
})
// view all posts
router.get('/view', validateSession, async (req, res) => {
    try {
        const allGigs = await GigModel.findAll({
            include: [{ model: CommentModel }]
        });
        res.status(200).json({ allGigs })
    } catch (err) {
        res.status(500).json({ msg: `Oh no, server error: ${err}` })
    }
})

// edit post by id (only lets you edit your own posts)
router.put('/edit/:gigId', validateSession, async (req, res) => {
    const { location, title, instrument, genre, size, content } = req.body;
    const { id } = req.user;
    const { gigId } = req.params

    try {
        const updatedGig = await GigModel.update({
            location,
            title,
            instrument,
            genre,
            size,
            content
        }, { where: { userId: id, id: gigId } });
            res.status(200).json({
                msg: `Gig updated`,
                updatedGig: updatedGig == 0? `none` : updatedGig
            })
    } catch (err) {
        res.status(500).json({ msg: `Oh no, server error: ${err}` })
    }
})

// ! Admin edit
router.put('/edit/:gigId/admin', validateRole, async (req, res) => {
    const { location, title, instrument, genre, size, content } = req.body;
    const { gigId } = req.params

    try {
            const updatedGig = await GigModel.update({
                location,
                title,
                instrument,
                genre,
                size,
                content
            }, { where: { id: gigId } });
            res.status(200).json({
                msg: `Gig updated`,
                updatedGig
            })
    } catch (err) {
        res.status(500).json({ msg: `Oh no, server error: ${err}` })
    }
})

// delete post by id
router.delete('/delete/:gigId', validateSession, async(req, res)=>{
    const { id } = req.user;
    const { gigId } = req.params
    try {
        const deletedGig = await GigModel.destroy({
            where: { userId: id, id: gigId }
        });
        res.status(200).json({
            msg: `Gig deleted.`,
            deletedGig: deletedGig == 0? `none` : deletedGig
        })
    } catch (err) {
        res.status(500).json({msg: `Oh no, server error: ${err}`})
    }
})

// ! ADMIN delete
router.delete('/delete/:gigId/admin', validateRole, async(req, res)=>{
    const { gigId } = req.params
    try {
        const deletedGig = await GigModel.destroy({
            where: { id: gigId }
        });
        res.status(200).json({
            msg: `Gig ,deleted.`,
            deletedGig: deletedGig == 0? `none` : deletedGig
        })
    } catch (err) {
        res.status(500).json({msg: `Oh no, server error: ${err}`})
    }
})

module.exports = router;