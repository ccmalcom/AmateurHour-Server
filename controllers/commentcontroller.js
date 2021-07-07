const router = require('express').Router();
const { CommentModel } = require('../models');
const validateSession = require('../middleware/validate-session');
const validateRole = require('../middleware/validate-role');

// create comment
router.post('/new', validateSession, async(req, res) =>{
    const { content, gigId } = req.body;
    const { id, fullName } = req.user;

    try {
        const Comment = await CommentModel.create({
            content,
            userId: id,
            gigId: gigId,
            posterName: fullName
        });
        res.status(200).json({msg: `Comment Created`, Comment})
    } catch (err) {
        res.status(500).json({msg: `Oh no, server error: ${err}`})
    }
})

// view comment by id
router.get('/view/:cid', validateSession, async(req, res)=>{
    const { cid } = req.params;

    try {
        const thisComment = await CommentModel.findOne({
            where: {id: cid}
        });
        res.status(200).json({msg: 'Comment created', thisComment})
    } catch (err) {
        res.status(500).json({msg: `Oh no, server error: ${err}`})
    }
})
// view all comments
router.get('/view', validateSession, async(req, res)=>{
    try {
        const allComments = await CommentModel.findAll()
        res.status(200).json({ allComments })
    } catch (err) {
        res.status(500).json({msg: `Oh no, server error: ${err}`})
    }
})

// edit comment by id
router.put('/edit/:cid', validateSession, async(req, res)=>{
    const { content } = req.body;
    const { id } = req.user;
    const { cid } = req.params
    try {
        const updatedComment = await CommentModel.update({content}, 
            {where: {userId: id, id: cid}});
            res.status(200).json({
                msg: 'Comment updated', 
                updatedComment: updatedComment == 0 ? `none` : updatedComment
            })
    } catch (err) {
        res.status(500).json({msg: `Oh no, server error: ${err}`})
    }
})

// delete comment by id
router.delete('/delete/:cid', validateSession, async(req, res)=>{
    const { id } = req.user;
    const { cid } = req.params;
    try {
        const deletedComment = await CommentModel.destroy({
            where: { userId: id, id: cid}
        });
        res.status(200).json({msg: 'Comment deleted', deletedComment: deletedComment == 0? 'none' : deletedComment})
    } catch (err) {
        res.status(500).json({msg: `Oh no, server error: ${err}`})
    }
})

// !ADMIN delete
router.delete('/delete/:cid/admin', validateRole, async(req, res)=>{
    const { cid } = req.params;
    try {
        const deletedComment = await CommentModel.destroy({
            where: {id: cid}
        });
        res.status(200).json({msg: 'Comment deleted', deletedComment: deletedComment == 0? 'none' : deletedComment})
    } catch (err) {
        res.status(500).json({msg: `Oh no, server error: ${err}`})
    }
})

module.exports = router;