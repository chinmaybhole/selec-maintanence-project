const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationdata = Schema(
  {
    unit_building: {
      type: String,
      required: true,
    },
    floor: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const ticket = Schema(
  {
    // ticket_name:{
    //     type: String,
    //     default: function(){
    //         let name = 'ticket'
    //         let count = 1
    //         let ticketname = name + String(count)
    //         count ++
    //         return ticketname
    //     }
    // },
    requestee_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    image: {
      type: String,
    },
    subject: {
      type: String,
      maxlength: 150,
      require: true,
      default: "",
    },
    description: {
      type: String,
      maxlength: 250,
      required: true,
      default: "",
    },
    company: {
      type: String,
      required: true,
      default: "selec",
    },
    status: {
      type: String,
      maxlength: 30,
      required: true,
      default: "open",
    },
    reason: {
      type: String,
      maxlength: 350,
      default: "",
    },
    escalate: {
      // escalted is required if is_escalated is defined by the user (escalated_reason is required too) or else default is false
      type: new Schema(
        {
          is_escalated: Boolean,
          escalated_reason: {
            type: String,
            maxlength: 350,
            required: true,
            default: null,
          },
        },
        { _id: false }
      ),
      required: false,
    },

    open_at: {
      type: Date,
      required: true,
      default: function () {
        var utc = new Date();
        utc.setHours(utc.getHours() + 5);
        utc.setMinutes(utc.getMinutes() + 30);
        return utc;
      },
    },
    close_at: {
      type: Date,
      default: null,
    },
    ticket_type: {
      type: String,
      required: true,
      default: "schedule",
    },
    asset_name: {
      type: Schema.Types.ObjectId,
      ref: "assetData",
      required: true,
    },
    schedule_time: {
      type: String,
      default: null,
    },
    accepted_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    location: {
      type: locationdata,
      required: true,
    },
    checklist: {
      type: Schema.Types.ObjectId,
      ref: "checkList",
    },
  },
  { timestamps: true }
);

ticket.pre(
  "deleteOne",
  { document: false, query: true },
  async function (next) {
    const doc = await this.model.findOne(this.getFilter());
    if (doc === null) next();

    await this.model.findByIdAndDelete(this.getFilter()).exec();
    next();
  }
);

module.exports = { Ticket: mongoose.model("ticket", ticket), locationdata };
