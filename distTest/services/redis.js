"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis = require("redis");
const Redlock = require("redlock");
class Redis {
    static RedLock(retryCount = 500, retryDelay = 50, retryVariance = 200) {
        const opts = {
            driftFactor: 0.01,
            retryCount: retryCount,
            retryDelay: retryDelay,
            retryJitter: retryVariance
        };
        return new Redlock([this.SharedInstance()], opts);
    }
    static RedisClient() {
        return this.SharedInstance();
    }
    static setValueForKey(keyName, value) {
        return new Promise((resolve, reject) => {
            Redis.SharedInstance().set(keyName, value, (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res === 'OK');
            });
        });
    }
    static setValueForKeyIfNoneExists(keyName, value) {
        return new Promise((resolve, reject) => {
            Redis.SharedInstance().setnx(keyName, value, (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res === 1);
            });
        });
    }
    static removeValueForKey(key) {
        return new Promise((resolve, reject) => {
            Redis.SharedInstance().del(key, (err) => {
                if (err) {
                    return reject(false);
                }
                resolve(true);
            });
        });
    }
    static keys(keyNamePattern) {
        return new Promise((resolve, reject) => {
            Redis.SharedInstance().keys(keyNamePattern, (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            });
        });
    }
    static setValueForKeyWithExpiration(keyName, value, expiration) {
        return new Promise((resolve, reject) => {
            Redis.SharedInstance().setex(keyName, expiration, value, (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res === 'OK');
            });
        });
    }
    static valueForKey(keyName) {
        return new Promise((resolve, reject) => {
            Redis.SharedInstance().get(keyName, (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            });
        });
    }
    static pushToHashSet(hashSetName, key, value) {
        return new Promise((resolve, reject) => {
            Redis.SharedInstance().hset(hashSetName, key, value, (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res === 1);
            });
        });
    }
    static valuesForHashSet(hashSetName) {
        return new Promise((resolve, reject) => {
            Redis.SharedInstance().hgetall(hashSetName, (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            });
        });
    }
    static lengthOfListWithKey(listKey) {
        const client = Redis.SharedInstance();
        return new Promise((resolve, reject) => {
            client.llen(listKey, (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            });
        });
    }
    static keyExists(keyName) {
        return new Promise((resolve, reject) => {
            Redis.SharedInstance().exists(keyName, (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res === 1);
            });
        });
    }
    static pushToOrCreateList(listName, value) {
        return new Promise((resolve, reject) => {
            Redis.SharedInstance().rpush(listName, value, (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res === 1);
            });
        });
    }
    static pushToExistingList(listName, value) {
        return new Promise((resolve, reject) => {
            Redis.SharedInstance().rpushx(listName, value, (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            });
        });
    }
    static arrayValues(keyName, offsetOne, offsetTwo) {
        return new Promise((resolve, reject) => {
            Redis.SharedInstance().lrange(keyName, offsetOne, offsetTwo, (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            });
        });
    }
    static setKeyTimeout(keyName, milliseconds) {
        const timeStamp = String(milliseconds);
        const cmd = `PEXPIRE`;
        return new Promise((resolve, reject) => {
            const client = Redis.SharedInstance();
            client.send_command(cmd, [keyName, timeStamp], (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res === 1);
            });
        });
    }
    static flushRedis() {
        return new Promise((resolve, reject) => {
            const client = Redis.SharedInstance();
            client.flushall((err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res === 'OK');
            });
        });
    }
    static transaction(transactionCommands, done) {
        const multiClient = Redis.SharedInstance().multi();
        transactionCommands(multiClient);
        multiClient.exec(done);
    }
    static SharedInstance() {
        if (!Redis._instance) {
            const clientOpts = Redis.clientOptions();
            Redis._instance = redis.createClient(clientOpts);
        }
        return Redis._instance;
    }
    static clientOptions() {
        return {
            host: "localhost",
            port: 6379
        };
    }
}
exports.default = Redis;
