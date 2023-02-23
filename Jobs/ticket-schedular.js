const { Ticket } = require('../Models/ticket.models')
const utils = require('../Utils/common.utils')

async function schedular (asset_id, scheduledata, checklistdata, locationdata) {
    try {
        let scheduletime = scheduledata
        let assetdata = asset_id

        // await Ticket.findOneAndUpdate({ asset_name: asset_id, status: "open", ticket_type: "schdule" }, { $push: { status: "close" } }, { new: true })

        // monthly maintenance subject
        body = {
            subject: 'schedule maintenance',
            description: 'schedule maintenance of asset ' + asset_id,
            schedule_time: scheduletime,
            checklist: checklistdata,
            asset_name: asset_id,
            location: locationdata
        }

        // convert any upper case letters to lower before sending to database
        body = utils.lowercasedata(body)

        const newTicket = new Ticket(body)
        let sendTicket = await newTicket.save()

        if (!sendTicket) return { "tstatus": 500, "tresult": "Error while saving ticket, try again" }
        if (sendTicket) return { "tstatus": 200, "tresult": sendTicket }

    } catch (error) {
        return new Error({ error: error })
    }
}
// async schedular1() {
//     try {
//         console.log("schedular 1")
//     } catch (error) {

//     }
// },
// async schedular2() {
//     try {
//         console.log("schedular 2")
//     } catch (error) {

//     }
// }

module.exports = { schedular }