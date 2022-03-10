const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HospitalSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true
    },   
    hospital_name: {
        type: String,
        required: [true, 'Hospital name is required']
    },
    address1: {
        type: String,
        required: [true, 'Address Line 1 is required']
    },
    address2: {
        type: String,
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    postcode: {
        type: String,
        required: [true, 'Postcode is required']
    }
});

const Hospital = mongoose.model('hospital', HospitalSchema)

module.exports = Hospital;
