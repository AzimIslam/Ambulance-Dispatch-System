const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DispatchSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },  
    assigned_case: { type: Schema.Types.ObjectId, ref: 'case', required: true},
    assigned_ambulance: {type: Schema.Types.ObjectId, ref: 'case' },
    completed: {
        type: Boolean,
        default: false,
    }
});

const Dispatch = mongoose.model('dispatch', DispatchSchema)

module.exports = Dispatch;