// a pet has an OWNER field that is a USER
// eventually will hold an array of TOY subdocs

const mongoose = require('mongoose')
const { Schema, model } = mongoose

const toySchema = require('./toy')

const petSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        adoptable: {
            type: Boolean,
            required: true
        },
        toys: [toySchema],
        owner: {
            type: Schema.Types.ObjectId,
			ref: 'User'
        }
    }, {
        timestamps: true,
        // will add "virtuals" to our model
        // following lines ensure that virtuals are included when JSON or an Object are returned
        toObject: { virtuals: true },
        JSON: { virtuals: true }
    }
)

// virtuals go here
// "virtual" properties use existing data that is saved in the db to add extra properties
// when documents are retrieved and converted to JSON or an Object
petSchema.virtual('fullTitle').get(function () {
    // in here, JavaScript can be used to make sure a value is returned and assigned to this virtual
    // 'fullTitle' will combine the name and type of Pet to build a title
    return `${this.name} the ${this.type}`
})

petSchema.virtual('isABaby').get(function () {
    if (this.age < 5) {
        return "yeah, they're just a baby"
    } else if (this.age >= 5 && this.age < 10) {
        return "not really a baby, but still a baby"
    } else {
        return "a good old pet (definitely still a baby)"
    }
})

module.exports = model('Pet', petSchema)