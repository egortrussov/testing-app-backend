const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    createdTests: [{
        testId: String
    }],
    passedTests: [{
        points: Number,
        maxPoints: Number,
        testId: String,
        title: String,
        date: Date,
        answers: [Number]
    }],
    name: String,
    email: String,
    password: String,
    lastCreatedPost: {
        type: Number,
        required: false,
        default: 0
    }
})

module.exports = User = mongoose.model('User', UserSchema);