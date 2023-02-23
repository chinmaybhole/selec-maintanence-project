function crongen(schedular, day, start_date, start_time) {

    let cronmonth = "*", crondateofmonth = "*", cronweekday = "*"
    let weekdays = ["sunday", "monday", "tuesday", "wednesday", "thusday", "friday", "saturday"]

    // converts day to number
    if (day) {
        cronweekday = weekdays.indexOf(day)
    }

    // split date
    const [year, month, date] = start_date.split('-')
    crondateofmonth = date

    // convert schedule to cron data
    if (schedular == "quarterly") {
        cronmonth = "*/3"
        cronweekday = "*"

    } else if (schedular == "6 months") {
        cronmonth = "*/6"
        cronweekday = "*"

    } else if (schedular == "yearly") {
        cronmonth = month
        cronweekday = "*"
    }

    // split time
    const [hour, minute, seconds] = start_time.split(":")

    let cronstring = minute + " " + hour + " " + crondateofmonth + " " + cronmonth + " " + cronweekday
    return cronstring
}

module.exports = { crongen }