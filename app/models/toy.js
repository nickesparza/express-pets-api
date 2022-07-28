const mongoose = require('mongoose')

// toy is NOT a model, it's a subdocument
// toy will be part of a toys array added to specific pets

// do not need model from mongoose, but do need Schema
// skip destructuring to save space

const toySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    isSqueaky: {
        type: Boolean,
        default: false,
        required: true
    },
    condition: {
        type: String,
        // use enum, which means only specific strings are allowed to satisfy this field
        // enum is a validator on the String type that only permits a set collection of values
        enum: ['new', 'used', 'disgusting'],
        default: 'new'
    }
}, {
    timestamps: true
})

module.exports = toySchema