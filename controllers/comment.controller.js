const mongoose = require('mongoose')
const Comment = require('../models/comment.model')

module.exports.newComment = (req, res) => {
    const commentData = req.body
    commentData.user = req.currentUser._id
    commentData.product = req.params.id
    commentData.photo = req.file ? req.file.path : null

    const comment = new Comment(commentData)
    comment.save()
        .then(() => res.redirect(`/products/${req.params.id}`))
        .catch(err => console.log(err))
}