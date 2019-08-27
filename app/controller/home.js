'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const cPath = '/test1111';
    const list = await this.ctx.service.zk.get_children('/');
    console.log(list);

    const createRes = await this.ctx.service.zk.create(cPath, `${cPath} text`);
    console.log(createRes);

    const getRes = await this.ctx.service.zk.get(cPath);
    console.log(getRes);
    console.log(getRes[1]);

    const updateRes = await this.ctx.service.zk.update(cPath, `${cPath} is change`, getRes[0].version);
    console.log(updateRes);

    const deleteRes = await this.ctx.service.zk.delete('/test220000000014');
    console.log(deleteRes);

    ctx.body = 'hi, egg';
  }
}

module.exports = HomeController;
