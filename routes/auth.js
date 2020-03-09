const router = require('express').Router();
const User = require('../model/User')
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('../validation');

router.post('/register', async (req,res) => {
    //Lets validate the data before we a user
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if(emailExist) return res.status(400).send('Email already exist')

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    } catch (error) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req,res) => {
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if the email exist
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Email is not found');

    //Passwordis correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid  password');

    res.status(200).send('Logged in');

});

module.exports = router;