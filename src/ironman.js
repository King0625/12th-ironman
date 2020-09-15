const Scraper = require('./scraper');

class Ironman extends Scraper {
  constructor(_member) {
    super();
    this.member = _member;
  }


  pageOptions(page = undefined) {
    const urlPieces = this.member.ironmanUrl.split('/');
    urlPieces.splice(3, 0, "m/api");
    const apiUrl = urlPieces.join('/');

    return {
      method: "GET",
      url: `${apiUrl}?page=${page}`,
      json: true
    }
  }


  async getLastPageData() {
    const firstPageOptions = this.pageOptions();
    const firstPageData = await this.crawl(firstPageOptions);
    const totalPages = firstPageData.paginator.total_pages;
    let lastPageData;
    if (totalPages == 1) {
      lastPageData = firstPageData;
    } else {
      const lastPageOptions = this.pageOptions(totalPages);
      lastPageData = await this.crawl(lastPageOptions);
    }

    return lastPageData.data;
  }


  async getStatus() {
    const { camp, name, ironmanUrl } = this.member;
    const lastPageData = await this.getLastPageData();
    const account = lastPageData.user.account;
    const avatar = lastPageData.user.avatar;
    const subject = lastPageData.ironman.subject;
    const topicCount = lastPageData.ironman.topic_count;
    const lastPageArticles = lastPageData.articles;
    const lastArticle = lastPageArticles[lastPageArticles.length - 1];

    const lastArticleLink = lastArticle == undefined ? null : `https://ithelp.ithome.com.tw/articles/${lastArticle.article_id}`;

    const lastArticleSubject = lastArticle == undefined ? null : lastArticle.subject;

    const lastArticleCreatedTimestamps = lastArticle == undefined ? null : lastArticle.created_at;

    const hasFinishedToday = lastArticle == undefined ? false : new Date().setHours(0, 0, 0, 0) == new Date(lastArticleCreatedTimestamps).setHours(0, 0, 0, 0);

    const lastFinishedDatetime = lastArticle == undefined ? null : new Date(lastArticleCreatedTimestamps).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });


    return {
      camp,
      name,
      account,
      avatar,
      subject,
      ironmanUrl,
      topicCount,
      lastArticleLink,
      lastArticleSubject,
      lastFinishedDatetime,
      hasFinishedToday
    }
  }
}

module.exports = Ironman;