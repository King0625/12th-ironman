const Scraper = require('./scraper');

class Notification extends Scraper {
  constructor(_slackUrl, _message) {
    super();
    this.slackUrl = _slackUrl;
    this.message = _message;
  }

  async send() {
    const options = {
      url: this.slackUrl,
      method: "POST",
      body: {
        "text": this.message
      },
      headers: {
        "Content-type": "application/json"
      },
      json: true
    }

    const result = await this.crawl(options);
    console.log(result);
  }
}

module.exports = Notification;