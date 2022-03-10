const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AmbulanceSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true
    },
    first_name: {
        type: String,
        required: [true, 'First name is required']
    },
    surname: {
        type: String,
        required: [true, 'Surname is required']
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    locations: [{type: Schema.Types.ObjectId, ref: 'location'}],
    hospital: { type: Schema.Types.ObjectId, ref: 'hospital', required: true}
});

const Ambulance = mongoose.model('ambulance', AmbulanceSchema)

module.exports = Ambulance;