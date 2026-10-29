const User = require('../models/User.js');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username) {
            req.flash('validationErrors', 'Please provide username.');
        }
        if (!password) {
            req.flash('validationErrors', 'Please provide password.');
        }
        if (!username || !password) {
            return res.redirect('/auth/login');
        }

        const user = await User.findOne({ username });

        if (!user) {
            req.flash('validationErrors', 'Invalid username or password.');
            return res.redirect('/auth/login');
        }

        const same = await bcrypt.compare(password, user.password);

        if (same) {
            req.session.userId = user._id;
            res.redirect('/');
        } else {
            req.flash('validationErrors', 'Invalid username or password.');
            res.redirect('/auth/login');
        }
    } catch (error) {
        console.error(error);
        req.flash('validationErrors', 'Something went wrong. Please try again.');
        res.redirect('/auth/login');
    }
};
