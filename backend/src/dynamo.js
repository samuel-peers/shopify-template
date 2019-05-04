import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
const tableName = 'magnet-dynamodb';

const buildDynamo = () => ({
  getAccessToken: async storeName => {
    const params = {
      TableName: tableName,
      Key: {
        store: {
          S: storeName
        }
      }
    };

    return dynamodb.getItem(params).promise();
  },

  putAccessToken: (storeName, accessToken) => {
    const putparams = {
      TableName: tableName,
      Item: {
        store: {
          S: storeName
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

export default buildDynamo;
