const IS_OFFLINE = process.env.IS_OFFLINE;
const QUOTES_TABLE = process.env.QUOTES_TABLE;
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");
const AWS = require("aws-sdk");
const Joi = require("joi");

const app = express();
const RestController = require("./rest.controller");
const RestValidator = require("./rest.validator");
const RestService = require("./rest.service");
app.use(morgan("combined"));
app.use(bodyParser.json({ strict: false }));

// setup the database
let dynamoDb;
if (IS_OFFLINE === "true") {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: "localhost",
    endpoint: "http://localhost:8000"
  });
  console.log(dynamoDb);
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
}
// set up validation schemas
const create = Joi.object()
  .keys({
    quote: Joi.string().required(),
    author: Joi.string().required()
  })
  .required();

const update = Joi.object()
  .keys({
    quote: Joi.string(),
    author: Joi.string()
  })
  .required();

// instantiate dependacies
const validator = new RestValidator(create, update);
const service = new RestService(QUOTES_TABLE, dynamoDb);
const quotesController = new RestController(validator, service);

app.get("/", (req, res) => quotesController.index(req, res));
app.post("/", (req, res) => quotesController.create(req, res));
app.get("/:id", (req, res) => quotesController.find(req, res));
app.patch("/:id", (req, res) => quotesController.update(req, res));
app.delete("/:id", (req, res) => quotesController.delete(req, res));

module.exports.handler = serverless(app);
