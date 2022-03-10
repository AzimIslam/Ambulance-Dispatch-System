const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DispatcherSchema = new Schema({
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
    cases: [{type: Schema.Types.ObjectId, ref: 'case'}]
})

const Dispatcher = mongoose.model('dispatcher', DispatcherSchema)

module.exports = Dispatcher;