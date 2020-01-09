const puppeteer = require('puppeteer');
const apiHelper = require("./api/api");
const util = require('./util');
const chalk = require("chalk");
const md5 = require('md5');
const log = console.log;

//配置
const _CONFIG = {
  base_url: 'http://127.0.0.1:8360', //后台地址
  page_size: 10, //页数
  time: util.Format(new Date(), 'yyyyMMddhhmmss'), //时间
  count: 100, //条数
  page: 10
};

//拉取npm启动入参
let argv;
try {
  argv = JSON.parse(process.env.npm_config_argv).remain;
} catch (ex) {
  argv = process.argv;
}

let api = {
  //初始化配置
  init() {
    if (argv && argv[0]) {
      _CONFIG.count = argv[0].split('=')[1];
      _CONFIG.page = Math.ceil(_CONFIG.count / _CONFIG.page_size);
    }
  },
  //登录
  async login() {
    log('登录中');
    apiHelper.getApi({
      method: 'POST',
      url: _CONFIG.base_url + '/admin/login',
      data: {
        username: 'test',
        password: md5('666666a')
      }
    }).then(res => {
      if (res.code === 0) {
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
        source_id: item.id,
        publish_status: 1,
        category_id: 9
      };
    });
    apiHelper.getJsonApi({
      method: 'POST',
      url: _CONFIG.base_url + '/admin/article',
      data: list
    }).then(res => {
      if (res.code === 0) {
        log(chalk.green('写入成功'));
      } else {
        log(chalk.red(res.msg));
      }
    });
  },
  //抓取快讯
  async getNews() {
    log(chalk.yellow(`正在抓取第${_CONFIG.page}页`));
    return apiHelper.getApi({
      method: 'GET',
      url: `https://lianmishu.com/wapi/kuaixun/list/?time=${_CONFIG.time}&type=down&pagesize=${_CONFIG.page_size}&sourceid=-1`,
    });
  }
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  log(chalk.green('服务启动成功'));
  api.init();
  // await api.login();
  let list = [];
  log('开始抓取数据');
  // for (let i = 1; i < _CONFIG.page; i++) {
  //   const news = await api.getNews();
  //   await page.waitFor(1000);
  //   list.push(news.data);
  // }
  log('抓取数据结束');
  log(list);
  // await api.addNews(news.data);
  log(chalk.green('服务关闭'));
  await browser.close();
})();
