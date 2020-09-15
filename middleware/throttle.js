const redis = require('../lib/redis');

module.exports = limit => {
  return async (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;;
    const getNumsOfRequest = await redis.get(ip);
    console.log(`${new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei' })} -- Numbers of requests from ${ip} this minute: ${getNumsOfRequest == null ? 0 : getNumsOfRequest} `);

    if (getNumsOfRequest == null) {
      await redis.setex(ip, 60, 1)
    } else {
      await redis.incr(ip);
    }
    req.rateLimit = limit;
    req.requestRemains = limit - getNumsOfRequest - 1;

    if (req.requestRemains < 0) {
      return res.status(429).json({
        error: "Too many requests"
      });
    }
    next();
  }
}