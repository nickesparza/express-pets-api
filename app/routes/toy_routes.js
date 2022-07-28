const express = require('express')
const passport = require('passport')

const Pet = require('../models/pet')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// ROUTES GO HERE
// only need three: create, update, destroy
// set up using same conventions as other routes
// may need to refer to other files to ensure middleware is used correctly

// POST -> create a toy
// POST toys/pet_id

// PATCH -> update toys
// PATCH toys/pet_id/toy_id

// DELETE -> delete a toy
// DELETE toys/pet_id/toy_id



//export the router
module.exports = router