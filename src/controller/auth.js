const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const shortid = require('shortid')

exports.signup = (req, res) => {
    User.findOne({ email: req.body.email })
        .exec(async (error, user) => {
            if (user) return res.status(400).json({ message: 'User already registered.' })
            const { firstName, lastName, email, password } = req.body;
            const hash_password = await bcrypt.hash(password, 10);
            const _user = new User({ firstName, lastName, email, hash_password, username: shortid.generate() });
            // _user.save((error, data) => {
            //     if (error) {
            //         return res.status(400).json({
            //             message: 'Something went wrong.',
            //             error: error
            //         })
            //     }
            //     if (data) {
            //         return res.status(201).json({
            //             message: 'User Create Successfully...!'
            //         })
            //     }
            // })
            
    _user.save((error, user) => {
        if (error) {
          return res.status(400).json({
            message: "Something went wrong",
          });
        }
  
        if (user) {
            const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' })
          const { _id, firstName, lastName, email, role, fullName } = user;
          return res.status(201).json({
            token,
            user: { _id, firstName, lastName, email, role, fullName },
          });
        }
      });
        })
}

exports.signin = (req, res) => {
    User.findOne({ email: req.body.email })
        .exec(async (error, user) => {
            if (error) res.status(400).json({ error: error })
            if (user) {
                const isPassword = await user.authenticate(req.body.password);
                if (isPassword && user.role === 'user') {
                    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' })
                    const { _id, firstName, lastName, email, role, fullName } = user
                    res.status(200).json({
                        token: token,
                        user: {
                            _id, firstName, lastName, email, role, fullName
                        }
                    })
                } else {
                    res.status(400).json({ message: 'Invalid Password.' })
                }
            } else {
                res.status(400).json({ message: 'Something went wrong.' })
            }
        })
}
