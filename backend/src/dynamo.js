import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
const tableName = 'magnet-dynamodb';

const getDynamo = () => ({
  getAccessToken: async shop => {
    const params = {
      ProjectionExpression: 'accessToken',
      TableName: tableName,
      Key: {
        store: {
          S: shop
        }
      }
    };

    return dynamodb
      .getItem(params)
      .promise()
      .then(
        ({
          Item: {
            accessToken: { S }
          }
        }) => S
      );
  },

  putAccessToken: (shop, accessToken) => {
    const putparams = {
      TableName: tableName,
      Item: {
        store: {
          S: shop
        },
        accessToken: {
          S: accessToken
        }
      }
    };

    dynamodb.putItem(putparams, (err, data) => {
      if (err) console.log(err, err.stack);
      else console.log(data);
    });
  }
});

export default getDynamo;
