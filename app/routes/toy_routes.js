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
router.post('/toys/:petId', removeBlanks, (req, res, next) => {
    // get toy from req.body
    const toy = req.body.toy
    // get pet ID from req.params.petId
    const petId = req.params.petId
    // find pet
    Pet.findById(petId)
        .then(handle404)
        .then(pet => {
            console.log('this is the pet', pet)
            console.log('this is the toy', toy)
            // push toy into pet's toys array
            pet.toys.push(toy)
            // save pet
            return pet.save()
        })
        // send newly updated pet as json as a response
        .then(pet => res.status(201).json({ pet: pet }))
        .catch(next)
})

// PATCH -> update toys
// PATCH toys/pet_id/toy_id
router.patch('/toys/:petId/:toyId', requireToken, removeBlanks, (req, res, next) => {
    // save pet Id and toy Id to variables
    const toyId = req.params.toyId
    const petId = req.params.petId
    // find pet using petId
    Pet.findById(petId)
        .then(handle404)
        .then(pet => {
            // single out a toy (.id is a subdoc method to find something in an array of subdocuments)
            const theToy = pet.toys.id(toyId)
            // make sure the user sending the request is the owner
            requireOwnership(req, pet)
            // update toy with subdoc method
            theToy.set(req.body.toy)
            // return saved pet
            return pet.save()
        })
        .then(() => res.sendStatus(204))
        .catch(next)
})

// DELETE -> delete a toy
// DELETE toys/pet_id/toy_id
router.delete('/toys/:petId/:toyId', requireToken, (req, res, next) => {
    const { toyId, petId } = req.params
    // find the pet
    Pet.findById(petId)
        // handle a 404
        .then(handle404)
        // find and delete the toy
        .then(pet => {
            // find toy by subdoc Id
            const toyToDelete = pet.toys.id(toyId)
            // ensure user trying to perform this action is the owner
            requireOwnership(req, pet)
            // call remove on the subdoc
            toyToDelete.remove()
            // return saved pet
            return pet.save()
        })
        .then(() => res.sendStatus(204))
    // handle errors
        .catch(next)
})



//export the router
module.exports = router