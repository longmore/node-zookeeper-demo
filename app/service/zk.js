const Service = require('egg').Service;
const ZooKeeper = require('zookeeper').Promise;

const config = {
    connect: '127.0.0.1:2181',
    timeout: 5000,
    debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
    host_order_deterministic: false,
    data_as_buffer: false, // 取出来的数据为buff还是string
};
const client = new ZooKeeper(config);
client.on('connect', () => {
    console.log('zookeeper client is connected ....');
});
client.init();

class ZkService extends Service {
    constructor(options) {
        super(options);
    }

    async exists(path) {
        const res = await client.exists(path);
        return res;
    }

    /**
     *
     * @param {*} path
     * @param {*} data
     * @param {*} flag
     *  empty   default         断开不删除
     *  ZooKeeper.ZOO_EPHEMERAL 断开连接删除
     *  ZooKeeper.ZOO_SEQUENCE  断开链接不删除，名字附加一个递增数字
     */
    async create(path, data, flag = '') {
        try {
            const res = await client.create(path, data, flag);
            console.log(`(created: ${res})`);
            return res;
        } catch (error) {
            console.log(`${path} already exists`);
        }
    }

    async get(path, watch) {
        const res = await client.get(path, watch);
        return res;
    }

    // 根据path，查询当前下面子节点
    async get_children(path) {
        const res = await client.get_children(path);
        return res;
    }

    /**
     *
     * @param {*} path
     * @param {*} data
     * @param {*} version 必须。要有version，需要先get，拿到里面的version
     */
    async update(path, data, version = 0) {
        try {
            const res = await client.set(path, data, version);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     *
     * @param {*} path
     * @param {*} version 非必须。
     */
    async delete(path, version) {
        try {
            const res = await client.delete_(path, version);
            console.log(`(delete: ${res})`);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = ZkService
