const rp = require('request-promise');

class Scraper {
  async crawl(options) {
    const result = await rp(options);
    return result;
  }
}

module.exports = Scraper;