const cron = require('node-cron');
const Notification = require('../src/notification');

cron.schedule('55 11 * * *', async () => {
  const notification = new Notification(process.env.SLACK_WEBHOOK, "Hello~");
  await notification.send();
})

module.exports = cron;