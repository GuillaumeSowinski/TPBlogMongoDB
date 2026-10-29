const BlogPost = require('../models/blogPost.js');

module.exports = async (req, res) => {
    try {
        await BlogPost.create(req.body);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.redirect('/post/new');
    }
};
