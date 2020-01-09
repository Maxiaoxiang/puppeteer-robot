const puppeteer = require('puppeteer');
const apiHelper = require("./api/api");
const chalk = require("chalk");
const md5 = require('md5');
const log = console.log;

let api = {
  //登录
  async login() {
    log('登录中');
    apiHelper.getApi({
      method: 'POST',
      url: 'http://127.0.0.1:8360/admin/login',
      data: {
        username: 'test',
        password: md5('666666a')
      }
    }).then(res => {
      if(res.code === 0) {
        log(chalk.green('登录成功'));
      } else {
        log(chalk.red(res.msg));
      }
    });
  },
  //添加快讯
  async addNews(params) {
    log('正在写入数据库');
    const list = params.map(item => {
      return {
        title: item.content,
        author: item.source,
        content: item.content,
        publish_status: 1,
        category_id: 9
      };
    });
    apiHelper.getJsonApi({
      method: 'POST',
      url: 'http://127.0.0.1:8360/admin/article',
      data: list
    }).then(res => {
      if(res.code === 0) {
        log(chalk.green('写入成功'));
      } else {
        log(chalk.red(res.msg));
      }
    });
  },
  //抓取快讯
  async getNews() {
    return apiHelper.getApi({
      method: 'GET',
      url: 'https://lianmishu.com/wapi/kuaixun/list/?time=20200108154220&type=down&pagesize=10&sourceid=-1',
    });
  }
};

(async () => {
  const browser = await puppeteer.launch();
  log(chalk.green('服务正常启动'));
  await api.login();
  const res = await api.getNews();
  await api.addNews(res.data);
  await browser.close();
})();
