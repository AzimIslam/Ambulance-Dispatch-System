const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true
    },   
    longitude: {
        type: Number,
        required: [true, 'Longitude is required']
    },
    latitude: {
        type: Number,
        required: [true, 'Latitude is required']
    },
    ambulance: {
        type: Schema.Types.ObjectId,
        ref: 'ambulance',
        required: true,
    }
},
{
    timestamps: {
        createdAt: 'created_at'
    }        
});

const Location = mongoose.model('location', LocationSchema)

module.exports = Location;
