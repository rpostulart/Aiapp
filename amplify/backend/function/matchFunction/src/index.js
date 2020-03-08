/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiScanappGraphQLAPIIdOutput = process.env.API_SCANAPP_GRAPHQLAPIIDOUTPUT
var apiScanappGraphQLAPIEndpointOutput = process.env.API_SCANAPP_GRAPHQLAPIENDPOINTOUTPUT

Amplify Params - DO NOT EDIT */ const AWS = require("aws-sdk");
AWS.config.region = process.env.REGION;
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
  try {
    let renderItems = await getItems();

    const text = event.arguments.input.text.toLowerCase();
    let foundItem = "";
    for (let i = 0, iMax = renderItems.length; i < iMax; i++) {
      if (text.includes(renderItems[i].text.toLowerCase())) {
        foundItem = renderItems[i];
        break;
      }
    }

    const response = {
      items: JSON.stringify(foundItem)
    };

    callback(null, response);
  } catch (error) {
    callback(error);
  }
};

function getItems() {
  let tableName = "text";
  if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName =
      tableName +
      "-" +
      process.env.API_SCANAPP_GRAPHQLAPIIDOUTPUT +
      "-" +
      process.env.ENV;
  }

  let scanParams = {
    TableName: tableName
  };

  return new Promise((resolve, reject) => {
    dynamodb.scan(scanParams, (err, data) => {
      if (err) {
        console.log("err", err);
        reject(err);
      } else {
        console.log("Query succeeded.");
        resolve(data.Items);
      }
    });
  });
}
