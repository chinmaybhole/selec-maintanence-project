const Agenda = require('agenda');
const initializeJob = require('../Jobs/agenda-schedular')

// Database connection 
const connectionString = process.env.DB_CONNECTION;

// Configuring agenda by providing DB details
const agenda = new Agenda({
    db: {address: connectionString, collection: 'agendaJobs'},
    processEvery: "10 seconds"
});

// 'ready' - called when Agenda mongo connection is successfully opened and indices created.
// agenda.once('ready', () => {
//     initializeJob(agenda)
//     console.log("agenda ready")

// })

// initalized a job function which will define and process the job for respective tasks 
agenda.on('ready', () => console.log("agenda ready"))

// 'error' - called when Agenda mongo connection process has thrown an error
agenda.on('error', (err) => console.log(err))

// initalized a job function which will define and process the job for respective tasks 
// initializeJob(agenda)

// init() will start the agenda process if we get success on above procedures
async function init() {
    await agenda.start();
}

module.exports = {
    init,
    agenda
};