const router = require('express').Router();
const redis = require('../lib/redis');
const Ironman = require('../src/ironman');
const members = require('../members');

router.get('/', async (req, res, next) => {
  const fetchData = async () => {
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
    return data;
  }

  const data = await fetchData();
  res.append('X-RateLimit-Limit', req.rateLimit);
  res.append('X-RateLimit-Remaining', req.requestRemains);
  res.status(200).json({ data });
})

module.exports = router;