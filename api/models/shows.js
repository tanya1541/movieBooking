let mongoose = require('mongoose');

let showSchema = mongoose.Schema({
    movie: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    timing: {
        type: String,
        required: true,
        enum: ["11:30", "14:30", "17:00", "21:00"]
    },
    totalSeats: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("Show", showSchema);