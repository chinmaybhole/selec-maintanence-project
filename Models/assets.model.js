const mongoose = require('mongoose')
const Schema = mongoose.Schema

const assetData = new Schema({
    asset_name: {
        type: String,
        // require: true,
        unique: true
    },
    location: String,
    asset_category: {
        type: String,
        // unique: true,
        // require: true
    },
    asset_component_list: [{
        type: String
    }], // e.g area 1, area 2 or area 3
    asset_location: {
        type: Schema.Types.ObjectId,
        ref: "location"
    }
}, { timestamps: true })

const assetsConfig = new Schema({
    asset_id: {
        type: Number,
        // require: true,
        unique: true
    },
    asset_category: {
        type: String,
        unique: true,
        // require: true
    },
    asset_list: [assetData],
    template_master: {
        type: Schema.Types.ObjectId,
        ref: "machineData",
        default: null
    }
}, { timestamps: true })

let assetsconfig = mongoose.model('assetsConfig', assetsConfig);
let Asset = mongoose.model('assetData', assetData);
module.exports = { assetsconfig, Asset }