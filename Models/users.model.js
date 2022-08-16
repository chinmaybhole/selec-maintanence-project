const mongoose = require("mongoose");
const { Ticket } = require("./ticket.models");
const Schema = mongoose.Schema;

const role = new Schema({
    name: {
        type: String,
        index: true,
    },
});

const user = new Schema({

    user_id: {
        type: Number,
        require: true,
        unique: true,
        index: true,
    },
    username: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    first_name: {
        type: String,
        require: true,
    },
    middle_name: String,
    last_name: String,
    mobile_phone: {
        type: Number,
        unique: true,
        range: 10,
    },
    email_id: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email address",
        ],

    },
    company_name: {
        type: String,
        require: true,
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'role'
    },
    note: String,
    interface: String,
    asset_category: [{
        type: Schema.Types.ObjectId,
        ref: "assetsConfig",
    }, ],
    skills: [{
        // Lets take assets category as skills
        type: Schema.Types.ObjectId,
        ref: "assetData"
    }],
    location: {
        type: Schema.Types.ObjectId,
        ref: 'location'
    }
}, { timestamps: true });

user.pre('deleteOne', { query: true, document: false }, async function(next) {
    const uid = await this.model.findOne(this.getFilter())

    const doc = await Ticket.deleteOne({ client_id: uid._id })
    if (doc.deletedCount === 0) {
        console.log("No Tickets Found")
    }
    console.log("all user data removed")
    next()
})

module.exports = {
    Role: mongoose.model("role", role),
    User: mongoose.model("user", user),
};