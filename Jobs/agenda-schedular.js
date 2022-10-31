const jobsMapper = require('./jobs-mapper')

// initalizing agenda jobs
async function initializeJob(agenda) {

    // mapping each key from jobs mapper 
    Object.keys(jobsMapper).forEach(async key => {

        // define requires name of the define function, and a callback function
        agenda.define(key, (job, done) => {

            // mapping the handler of that respective key
            jobsMapper[key].handler()            
            done();
        })

        // providing details of type of process (for eg every,now), when the process should be repeated and 
        // name of the defined function
        await agenda[jobsMapper[key].type](jobsMapper[key].time, key,jobsMapper[key].data);
    })

}

module.exports = initializeJob;
