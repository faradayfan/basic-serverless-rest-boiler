const Joi = require("joi");

module.exports = class RestValidator {
  constructor(createSchema, updateSchema) {
    this.createSchema = createSchema;
    this.updateSchema = updateSchema;
  }
  create(obj) {
    return Joi.validate(obj, this.createSchema);
  }
  update(obj) {
    return Joi.validate(obj, this.updateSchema);
  }
};
