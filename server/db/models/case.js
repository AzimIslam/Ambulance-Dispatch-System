const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CaseSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    first_name: {
        type: String,
        required: [true, "First Name is required"]
    },
    surname: {
        type: String,
        required: [true, "Surname is required"]
    },
    notes: {
        type: String,
    },
    category: {
        type: Number,
        min: 1,
        max: 4,
        required: [true, "Category is required"]
    },
    longitude: {
        type: Number,
        required: [true, "Longitude is required"]
    },
    latitude: {
        type: Number,
        required: [true, "Latitude is required"]
    },
    symptoms: [{
        type: String
    }]
});

const Case = mongoose.model('case', CaseSchema)

module.exports = Case;