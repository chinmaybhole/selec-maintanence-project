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

// at 00:00 schedular will run a function in which it will look for current date's ticket for scheduling


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

const schedular_trigger = async (agenda) => {
    try {

        agenda.define("schedular_trigger", async (job, done, agenda) => {
            // check weather any tickets with schedule tag is present with current system date -1

            // getting current system datetime
            let currentsystemdatetime = new Date();
            // yesterday datetime
            let yesterdaydatetime = currentsystemdatetime.setDate(currentsystemdatetime.getDate() - 1)

            // list of unschedule tickets
            const unscheduledtickets = await Ticket.find({ ticket_type: 'schedule', createdAt: { $gte: yesterdaydatetime, $lt: currentsystemdatetime } })

            // scheduling each unschedule ticket
            for (let i in unscheduledtickets) {
                // name of the job
                key = "ticket " + Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))
                // defining a new job
                agenda.define(key, async (job, done) => {
                    // getting data from agenda's data object
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

                await agenda.every(unscheduledtickets[i].schedule_time, key, { oldticket: unscheduledtickets[i] })
            }


        })

        await agenda.every("0 0 * * *", "schedular_trigger")
    } catch (error) {
        throw Error({ "error": error })
    }
}

module.exports = { ticket_schedular }