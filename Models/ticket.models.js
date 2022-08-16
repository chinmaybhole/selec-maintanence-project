const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ticket = Schema({
    client_id: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    subject: {
        type: String,
        maxlength: 150,
        require: true,
        default: ""
    },
    description: {
        type: String,
        maxlength: 250,
        require: true,
        default: ""
    },
    company: {
        type: String,
        require: true,
        default: "selec"
    },
    status: {
        type: String,
        maxlength: 30,
        require: true,
        default: "open"
    },
    reason:{
        type: String,
        maxlength: 350,
        require: true,
        default: ""
    },
    escalated: {
        type: String,
        maxlength: 30,
        require: true,
        default: null 
    },
    escalated_reason: {
        type: String,
        maxlength: 350,
        require: true,
        default: null
    },
    open_at: {
        type: Date,
        require: true,
        default: function(){
            var utc = new Date();
            utc.setHours( utc.getHours() + 5);
            utc.setMinutes( utc.getMinutes() + 30);
            return utc
        }
    },
    close_at:{
        type: Date,
        require: true,
        default: null
    },
    ticket_type: {
        type: String,
        require: true,
        default: "schdule"
    },
    asset_name: {
        type: Schema.Types.ObjectId,
        ref: "assetData"
    },
    accepted: {
        type: Boolean,
        default: false
    },
    accepted_by: {
        type: Schema.Types.ObjectId,
        ref: "user",
        default: null
    },
    location: {
        type: String
        // eg area 1 or area 2
    }
})

ticket.pre('deleteOne',{ document: false, query: true }, async function(next){
    const doc = await this.model.findOne(this.getFilter())
    if (doc === null) next()
    
    await this.model.findByIdAndDelete(this.getFilter()).exec()
    next()
})

module.exports = {Ticket: mongoose.model("ticket", ticket)}