const Redis = require('ioredis');

let client;

function initRedis(uri) {
  if (!uri) throw new Error("Redis URI is required");

  if (!client) {
    client = new Redis(uri);
    console.log('Redis connected in PID:', process.pid);
  }

  return client;
}

function getRedis() {
  if (!client) throw new Error("Redis not initialized. Call initRedis() first.");
  return client;
}

module.exports = { initRedis, getRedis };
