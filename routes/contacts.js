const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { check, validationResult} = require('express-validator')
const User = require('../models/User')
const Contact = require('../models/Contact')

/*  @route  GET api/contacts
    @desc   Get all users contacts
    @access Private          */

router.get('/', auth, async (req, res) => {
    try {
        const contacts = await Contact.find({user: req.user.id}).sort({date: -1})
        res.json(contacts)
    } catch (error) {
        console.error(error.message)
        res,status(500).send('server error')
    }
})



/*  @route  POST api/contacts
    @desc   Add new contact
    @access Private          */

    router.post('/', [auth, [
        check('name', 'name is required').not().isEmpty(),
        check('email', 'please, enter a valid email for the contact').isEmail()

    ]], 
    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array() })
        }

        const {name, email, phone, type} = req.body 

        try {
            const newContact = Contact({
                name,
                email,
                phone,
                type,
                user: req.user.id
            })
            const contact = await newContact.save()
            res.json(contact)
        } catch (e) {
            console.error(e.message)
            res.status(500).send('Server error')
        }
    })




/*  @route  PUT api/contacts
    @desc   Update contact
    @access Private          */

router.put('/:id', (req, res) => {
    res.send('update contact')
})



/*  @route  DELETE api/contacts
    @desc   delete contact
    @access Private          */

    router.delete('/:id', (req, res) => {
        res.send('delete contact')
    })

//exporting
module.exports = router