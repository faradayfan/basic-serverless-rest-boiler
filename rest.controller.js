class RestController {
  /**
   *
   * @param {QuotesValidator} validator
   * @param {QuotesService} service
   */
  constructor(validator, service) {
    this.validator = validator;
    this.service = service;
  }

  index(req, res) {
    return this.service
      .getAll()
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }

  create(req, res) {
    const result = this.validator.create(req.body);
    if (result.error) {
      return res.status(400).json(result.error);
    }

    return this.service
      .create(result.value)
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }

  find(req, res) {
    return this.service
      .findById(req.params.id)
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }

  update(req, res) {
    const result = this.validator.update(req.body);
    if (result.error) {
      return res.json(result.error);
    }

    return this.service
      .updateById(req.params.id, result.value)
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }

  delete(req, res) {
    return this.service
      .deleteById(req.params.id)
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
}

module.exports = RestController;
