let CronJob = require('cron').CronJob;

const { SECONDS_FROM_FIRST_MESSAGE } = require("../../config.json")

var users = []

async function cronJob() {
    let job = new CronJob('* * * * * *', function() {
    let currentTime = new Date()
    users = users.filter((element) => currentTime - element.firstMessageTime < 1000 * SECONDS_FROM_FIRST_MESSAGE) // Keep anything less than 5 seconds old
}, null, true, 'America/Los_Angeles');
job.start();
}

module.exports = cronJob;