const cron = require('node-cron');
const Notification = require('../src/notification');
const Ironman = require('../src/ironman');
const members = require('../members');

async function sendMessage(phase) {
  const promises = [];
  for (member of members) {
    const ironman = new Ironman(member);
    const status = await ironman.getStatus();
    promises.push(status);
  }
  const data = await Promise.all(promises);
  const hasNotFinished = data.filter(el => !el.hasFinishedToday);
  if (hasNotFinished.length == 0) {
    console.log(`${new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei' })} -- All members have completed!`);
    return;
  }
  const hasNotFinishedFromWeb = hasNotFinished.filter(el => el.camp == "Web")
  const hasNotFinishedFromIos = hasNotFinished.filter(el => el.camp == "iOS")
  const hasNotFinishedFromAndroid = hasNotFinished.filter(el => el.camp == "Android")
  const hasNotFinishedFromBackend = hasNotFinished.filter(el => el.camp == "Backend")
  let prefix;
  switch (phase) {
    case 0:
      prefix = "<!channel> :thinking_face: `18:00 未發文的同學` : \n ";
      break;
    case 1:
      prefix = "<!channel> :rage: `21:00 未發文的同學` : \n ";
      break;
    case 2:
      prefix = "<!channel> :face_with_symbols_on_mouth: `21:30 未發文的同學` : \n ";
      break;
    default:
      break;
  }
  const message = `${prefix}*web camp* : ${toSlackIds(hasNotFinishedFromWeb)}\n *backend camp* : ${toSlackIds(hasNotFinishedFromBackend)}\n *android camp* : ${toSlackIds(hasNotFinishedFromAndroid)}\n *iOS camp* : ${toSlackIds(hasNotFinishedFromIos)}\n`

  console.log(message);
  const notification = new Notification(process.env.SLACK_WEBHOOK, message);
  await notification.send();
}

function toSlackIds(member_lists) {
  const slackIds = member_lists.map(el => `<@${findMembersByName(el.name).slackId}>`);
  return slackIds.join(' ');
}

function findMembersByName(name) {
  const member = members.find(el => el.name == name);
  return member;
}

cron.schedule('0 18 * * *', async () => {
  await sendMessage(0);
})

cron.schedule('0 21 * * *', async () => {
  await sendMessage(1);
})

cron.schedule('30 21 * * *', async () => {
  await sendMessage(2);
})

module.exports = cron;