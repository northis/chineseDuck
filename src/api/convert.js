var toJsonSchema = require('openapi-schema-to-json-schema');

var schema = require('./api_swagger.json');

var convertedSchema = toJsonSchema(schema);

console.log(convertedSchema);