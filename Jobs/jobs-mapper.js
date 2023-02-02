const ticketSchedular = require('../Jobs/ticket-schedular')
// const timeschedule = require('../Jobs/ticket-schedular')

const { Ticket } = require('../Models/ticket.models')
const utils = require('../Utils/common.utils')


// concatinates client given info into str (eg weekly on monday at 10:00)
// let time = schedule.schedular + "on" + schedule.day + "at" + schedule.start_time
// jobs will be listed here

// 1. ticket dictionary with params schedule
// 2. map ticket data to belew job dict
// 3. if new schdule ticket generated will push to job dict


const ticket_schedular = async (agenda) => {

    oldscheduletickets = await Ticket.find({ ticket_type: 'schedule' })
    lastscheduleticket = oldscheduletickets[oldscheduletickets.length - 1]
    if (!lastscheduleticket) {
        return null
    } else {

        // name of the job
        key = "ticket " + Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))
        agenda.define(key, async (job, done) => {
            
            // let ticket_id = job.attrs.ticket_id
            // await Ticket.findOneAndUpdate({ asset_name: asset_id, status: "open", ticket_type: "schdule" }, { $push: { status: "close" } }, { new: true })
            // oldscheduleticket = await Ticket.find({ _id: ticket_id })
            // oldscheduleticket = oldscheduleticket[0]
            // monthly maintenance subject
            let { oldticket } = job.attrs.data

            body = {
                subject: 'schedule maintenance',
                description: 'schedule maintenance of asset ' + oldticket.asset_name,
                schedule_time: oldticket.schedule_time,
                checklist: oldticket.checklist,
                asset_name: oldticket.asset_name,
                location: oldticket.location
            }

            // convert any upper case letters to lower before sending to database
            body = utils.lowercasedata(body)

            const newTicket = new Ticket(body)
            let sendTicket = await newTicket.save()
            done();
        })

        await agenda.every(lastscheduleticket.schedule_time, key, { oldticket: lastscheduleticket })

    }


}

// const test1 = async (agenda) => {
//     agenda.define("test job", (job, done) => {

//         console.log("test job")
//         done()
//     })

//     await agenda.every("10 seconds", "test job")
// }

module.exports = { ticket_schedular }