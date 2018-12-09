const uuid = require("uuid");

module.exports = class RestService {
  /**
   *
   * @param {String} tableName
   * @param {AWS.DynamoDB.DocumentClient} db
   */
  constructor(tableName, db) {
    this.tableName = tableName;
    this.db = db;
  }
  /**
   *
   */
  getAll() {
    return new Promise((res, rej) => {
      this.db.scan(
        {
          TableName: this.tableName
        },
        (err, data) => {
          if (err) rej(err);
          else res(data);
        }
      );
    });
  }

  /**
   *
   * @param {Object} data
   */
  create(data) {
    const id = uuid.v4();

    const params = {
      TableName: this.tableName,
      Item: {
        id,
        ...data
      }
    };

    return new Promise((res, rej) => {
      this.db.put(params, error => {
        if (error) {
          rej(error);
        } else {
          res({ id, ...data });
        }
      });
    });
  }
  /**
   *
   * @param {String} id
   */
  findById(id) {
    const params = {
      TableName: this.tableName,
      Key: {
        id
      }
    };
    return new Promise((res, rej) => {
      this.db.get(params, (error, result) => {
        if (error) {
          rej({ error: "Could not get object." });
        }
        if (result.Item) {
          res(result.Item);
        } else {
          rej({ error: "Object not found." });
        }
      });
    });
  }
  /**
   *
   * @param {String} id
   * @param {Object} data
   */
  updateById(id, data) {
    const updateKeys = Object.keys(data);
    const params = {
      TableName: this.tableName,
      Key: {
        id
      },
      AttributeUpdates: updateKeys.reduce((a, k) => {
        a[k] = {
          Value: data[k],
          Action: "PUT"
        };
        return a;
      }, {})
    };

    return new Promise((res, rej) => {
      this.db.update(params, error => {
        if (error) {
          rej({ error: "Could not get object" });
        } else {
          res({ id, ...data });
        }
      });
    });
  }
  /**
   *
   * @param {String} id
   */
  deleteById(id) {
    const params = {
      TableName: this.tableName,
      Key: {
        id: id
      }
    };
    return new Promise((res, rej) => {
      this.db.delete(params, (error, result) => {
        if (error) {
          rej({ error: "Could not get object" });
        } else {
          res({ status: "Ok", result });
        }
      });
    });
  }
};
