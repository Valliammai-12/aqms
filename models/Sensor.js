const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 255,
    },
    carbon: {
        type: Number
    },
    co: {
        type: Number,
    },
    oxygen: {
        type: Number,
    },
    co2: {
        type: Number,
    },
    so2: {
        type: Number,
    },
});

module.exports = mongoose.model("Sensor", sensorSchema);