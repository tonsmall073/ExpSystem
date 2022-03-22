
class ConDatabases {
  mongo = require('mongodb').MongoClient;
  url = "mongodb://tonsmall073:wisaruth@mongo:27017/";
  async ExpSystem() {
    try {
      const db = await this.mongo.connect(this.url);
      const dbo = await db.db("ExpSystem");
      return dbo;
    } catch (err) {
      return err;
    }
  }
}

module.exports = ConDatabases;