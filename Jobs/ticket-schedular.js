const { Ticket } = require('../Models/ticket.models')
module.exports = {
    async schedular(req, asset_id, checklist, location) {
        try {
            req.body = {
                subject: 'asset maintenance',
                description: 'regular maintenance',
                checklist: checklist,
                asset_name: asset_id,
                location: location
            }

            // convert any upper case letters to lower before sending to database
            req.body = utils.lowercasedata(req.body)

            const newTicket = new Ticket(req.body)
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