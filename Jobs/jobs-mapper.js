const ticketSchedular = require('./ticket-schedular')
const {addSchedular} = require('../Controllers/admin.controllers')

// concatinates client given info into str (eg weekly on monday at 10:00)
// let time = schedule.schedular + "on" + schedule.day + "at" + schedule.start_time

// jobs will be listed here
module.exports = {

    ticket_schedular: {
        time: null,
        type: 'every',
        handler: ticketSchedular.schedular1
    },

    // ticket_schedular1: {
    //     time: '3 seconds',
    //     type: 'every',
    //     handler: ticketSchedular.schedular1
    // },
    // ticket_schedular2: {
    //     time: '5 seconds',
    //     type: 'every',
    //     handler: ticketSchedular
    // },
    // comp_schedular: {
    //     time: '2 seconds',
    //     type: 'every',
    //     handler: addSchedular
    // }

}
