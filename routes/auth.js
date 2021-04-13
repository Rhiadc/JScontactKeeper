const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');
const auth = require('../middleware/auth')
const User = require('../models/User');

/*  @route  GET api/auth
    @desc   get logged in user
    @access private          */

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("server error")        
    }
})

/*  @route  POST api/auth
    @desc   Auth user & get token
    @access public          */

router.post('/', [
    check('email', 'please enter a valid email').isEmail(),
    check('password', 'password is required').exists()
    ],
    async (req, res) => {
    //handling da validação de erros
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    const {email, password} = req.body

    try {
        //verificando se o email esta cadastrado, se não, retorna status com msg
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({msg: 'Invalid credentials'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({msg: 'Invalid credentials'})
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {
                expiresIn: 360000
            },
            (err, token) =>{
                if (err) throw err;
                res.json({ token })
            }
        )
    } catch (error) {
        console.error(e.message)
        res.status(500).send('server error')
    }
    
})


//exporting
module.exports = router