const { Ticket } = require('../Models/ticket.models')
const utils = require('../Utils/common.utils')

module.exports = {
    async schedular(asset_id, scheduledata, checklistdata, locationdata) {
        try {

        let schedule = schedule.bind(scheduledata)
            
        await Ticket.findOneAndUpdate({ asset_name: asset_id, status: "open", ticket_type: "schdule" }, { $push: { status: "close" } }, { new: true })

        // monthly maintenance suject
        body = {
            subject: 'asset maintenance',
            description: 'regular maintenance',
            checklist: checklistdata,
            asset_name: asset_id,
            location: locationdata
        }

        // convert any upper case letters to lower before sending to database
        body = utils.lowercasedata(body)

        const newTicket = new Ticket(body)
        let sendTicket = await newTicket.save()
        if (!sendTicket) return sendTicket
        if (sendTicket) return sendTicket

        } catch (error) {
            return new Error({ error: error })
        }
    },
    async schedular1() {
        try {
            console.log("schedular 1")
        } catch (error) {

        }
    },
    async schedular2() {
        try {
            console.log("schedular 2")
        } catch (error) {

        }
    }


}