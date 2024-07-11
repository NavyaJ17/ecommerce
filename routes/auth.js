const express = require('express');
const User = require('../models/User');
const passport = require('passport');
const router = express.Router();

router.get('/signup', (req, res) => {
    res.render('auth/signup');
})

router.post('/signup', async (req, res) => {
    let {email, role, username, password} = req.body;
    let user = new User({email, role, username});
    await User.register(user, password);
    res.redirect('/login');
})

router.get('/login', (req, res) => {
    res.render('auth/login');
})

router.post('/login', passport.authenticate('local',{
        failureRedirect: '/login',
        failureMessage: true
    }),
    function(req, res){
        req.flash('success', `Welcome Back ${req.user.username}!`);
        res.redirect('/products');
});

router.get('/logout', (req, res) => {
    req.logout(() => {
        req.flash('success', 'Logged out successfully');
        res.redirect('/products');
    });
});

module.exports = router;