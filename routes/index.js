const router = require('express').Router();
const redis = require('../lib/redis');
const { promisify } = require('util');
const wait = promisify(setTimeout);
const Ironman = require('../src/ironman');
const members = require('../members');

router.get('/', async (req, res, next) => {
  const fetchData = async () => {
    const request_in_progress = await redis.get('indexRoute');
    if (request_in_progress != null) {
      console.log("The request is in progress. Wait a moment!");
      await wait(2500);
      return await fetchData.call(this);
    }
    await redis.setex('indexRoute', 15, "true");
    let data;
    const redisData = await redis.get("result");
    if (redisData == null) {
      console.log("No redis data");

      const promises = [];
      for (member of members) {
        const ironman = new Ironman(member);
        const status = await ironman.getStatus();
        promises.push(status);
      }
      data = await Promise.all(promises);
      await redis.setex('result', 10, JSON.stringify(data));
    } else {
      data = JSON.parse(redisData);
    }

    await redis.del('indexRoute');
    return data;
  }

  const data = await fetchData();
  res.append('X-RateLimit-Limit', req.rateLimit);
  res.append('X-RateLimit-Remaining', req.requestRemains);
  res.status(200).json({ data });
})

module.exports = router;