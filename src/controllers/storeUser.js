const User = require('../models/User.js');

module.exports = async (req, res) => {
    try {
        await User.create(req.body);
        res.redirect('/');
    } catch (error) {
        if (error.code === 11000) {
            req.flash('validationErrors', 'That username is already taken.');
        } else if (error.errors) {
            const validationErrors = Object.keys(error.errors)
                .map(key => error.errors[key].message);
            validationErrors.forEach(msg => req.flash('validationErrors', msg));
        } else {
            console.error(error);
            req.flash('validationErrors', 'Something went wrong. Please try again.');
        }
        res.redirect('/auth/register');
    }
};
