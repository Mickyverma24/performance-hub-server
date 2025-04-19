const Redis = require("ioredis");

/*
  1. We will store here apikey and it's associted socket.ids of frontend to transer
     data of it's associated clients. 

     key - apiKey
     value - {socketids..,}
*/

class SocketRegister {
  constructor(redisClient) {
    this.redis = redisClient;
  }

  /**
   * Add a socket ID to a set associated with the given API key.
   * If the set does not exist, Redis will automatically create it.
   * @param {string} apiKey - Unique key representing a user/session/app.
   * @param {string} socketId - The socket ID to add.
   */
  async set(apiKey, socketId) {
    try {
      await this.redis.sadd(apiKey, socketId); // adds socketId to the set (creates set if not exists)
    } catch (err) {
      console.error("Error while setting socketId:", err.message);
    }
  }

  /**
   * Check whether the given API key exists and has one or more socket IDs.
   * @param {string} apiKey
   * @returns {boolean} - true if at least one socket ID exists, false otherwise
   */
  async has(apiKey, socketId) {
    try {
      const exists = await this.redis.sismember(apiKey, socketId); // returns 1 if present, 0 if not
      return exists === 1;
    } catch (err) {
      console.error("Error while checking socketId existence:", err.message);
      return false;
    }
  }

  /**
   * Get all socket IDs associated with the given API key.
   * @param {string} apiKey
   * @returns {string[]} - array of socket IDs
   */
  async get(apiKey) {
    try {
      return await this.redis.smembers(apiKey); // returns all socketIds as array
    } catch (err) {
      console.error("Error while fetching socket IDs:", err.message);
      return [];
    }
  }

  /**
   * Remove a socket ID from the set of the given API key.
   * If no socket IDs remain after removal, the key is deleted.
   * @param {string} apiKey
   * @param {string} socketId
   */
  async remove(apiKey, socketId) {
    try {
      await this.redis.srem(apiKey, socketId); // remove socketId from the set

      const remaining = await this.redis.scard(apiKey); // how many remain?
      if (remaining === 0) {
        await this.redis.del(apiKey); // clean up empty key
      }
    } catch (err) {
      console.error("Error while removing socketId:", err.message);
    }
  }
}

module.exports = SocketRegister;
