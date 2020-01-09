const http = require('http');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));

const apiFun = {
  getJsonApi(opt) {
    return new Promise(function (resolve, reject) {
      const option = {
        method: opt.method || 'POST',
        url: opt.url || '',
        json: true,
        headers: {},
      };
      if (option.method === 'POST') {
        option.body = opt.data || {};
      }
      request(option).then(function (response) {
        if (response.statusCode === 200) {
          let _data = response['body'];
          resolve(_data);
        } else {
          throw new Error('Request time out,Request address and parameters::' + opt.url);
        }
      }).catch(function (err) {
        reject(err);
      });
    });
  },
  getApi(opt) {
    return new Promise(function (resolve, reject) {
      const option = {
        method: opt.method || 'POST',
        url: opt.url || '',
        headers: {
          'Content-Type': "application/x-www-form-urlencoded",
        },
      };
      if (option.method === 'POST') {
        option.form = opt.data || {};
      }
      request(option).then(function (response) {
        if (response.statusCode === 200) {
          let _data = response['body'];
          _data = JSON.parse(_data);
          resolve(_data);
        } else {
          throw new Error('Request time out,Request address and parameters::' + opt.url);
        }
      }).catch(function (err) {
        reject(err);
      });
    });
  }
};

module.exports = apiFun;
