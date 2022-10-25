const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roomschema = new Schema({
    room:{
        type: String,
        require: true
    },
    assets: [{
        type: Schema.Types.ObjectId,
        ref: 'assetData',
        require: true
    }],
},{ _id : false })

const additionalDetails = new Schema({
    floor: {
        type: String,
        require: true
    },
    rooms: [roomschema],
},{ _id : false })


const location = new Schema({
    unit_or_building: {
        type: String,
        require: true,
        unique: true
    },
    subdivision:[ additionalDetails ],
    locality: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    state: {
        type: String,
        require: true
    },
    pin_code: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        require: true
    }
}, { timestamps: true })

const Location = mongoose.model('location', location)

module.exports = { Location }