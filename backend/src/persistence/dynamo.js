const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
const tableName = 'magnet-dynamodb';

const getDynamo = () => ({
  getToken: async (shop) => {
    const errorMsg = `AccessToken not found for ${shop}`;
    let result = null;

    const params = {
      ProjectionExpression: 'accessToken',
      TableName: tableName,
      Key: {
        store: {
          S: shop,
        },
      },
    };

    try {
      const {
        Item: {
          accessToken: { S },
        },
      } = await dynamodb.getItem(params).promise();
      result = S;
    } catch (error) {
      console.error(errorMsg, error);
    }

    return result;
  },

  putToken: (shop, accessToken) => {
    const errorMsg = `Failed to put accessToken for ${shop}`;
    const putparams = {
      TableName: tableName,
      Item: {
        store: {
          S: shop,
        },
        accessToken: {
          S: accessToken,
        },
      },
    };

    try {
      dynamodb.putItem(putparams, (err) => {
        if (err) {
          console.error(err, err.stack);
        }
      });
    } catch (error) {
      console.error(errorMsg, error);
    }
  },
});

module.exports = getDynamo;
