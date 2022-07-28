// npm run seed: node ./app/models/seed.js
// seed.js is the file that runs to seed the db with static values and create many pets at once
// be careful with this, when it runs it will delete all existing data in the db first!
// can modify it later to only delete pets without an owner, but keep it simple for now

const mongoose = require('mongoose')
const Pet = require('./pet')
const db = require('../../config/db')

const startPets = [
    { name: 'Sparky', type: 'dog', age: 2, adoptable: true},
    { name: 'Leroy', type: 'dog', age: 10, adoptable: true},
    { name: 'Biscuits', type: 'cat', age: 3, adoptable: true},
    { name: 'Hulk Hogan', type: 'hamster', age: 1, adoptable: true}
]

// first, connect to db
mongoose.connect(db, {
    useNewUrlParser: true
})
    .then(() => {
        // first remove all pets with no owner
        Pet.deleteMany({owner: null})
            .then(deletedPets => {
                console.log('deletedPets', deletedPets)
                // the next step is to create new seeded pets using startPets array
                Pet.create(startPets)
                    .then(newPets => {
                        console.log('newPets', newPets)
                        mongoose.connection.close()
                    })
                    .catch(error => {
                        console.log(error)
                        mongoose.connection.close()
                    })
            })
            .catch(error => {
                console.log(error)
                mongoose.connection.close()
            })
    })
    .catch(error => {
        console.log(error)
        mongoose.connection.close()
    })