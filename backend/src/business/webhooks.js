const axios = require('axios');
const crypto = require('crypto');

const validateWebhook = (appSecret, body, hmac) =>
  hmac ===
  crypto
    .createHmac('sha256', appSecret)
    .update(body, 'utf8', 'hex')
    .digest('base64');

const isSuccess = (result) =>
  Boolean(
    result.data &&
      result.data.webhookSubscriptionCreate &&
      result.data.webhookSubscriptionCreate.webhookSubscription,
  );

const buildQuery = (topic, address) => {
  const mutationName = 'webhookSubscriptionCreate';
  const webhookSubscriptionArgs = `{callbackUrl: "${address}"}`;

  return `
    mutation webhookSubscriptionCreate {
      ${mutationName}(
        topic: ${topic},
        webhookSubscription: ${webhookSubscriptionArgs}
      ) {
        userErrors {
          field
          message
        }
        webhookSubscription {
          id
        }
      }
    }
  `;
};

const registerWebhook = async ({
  address,
  topic,
  accessToken,
  shop,
  apiVersion,
}) => {
  // TODO shopify api access should be similar to rest.js
  const { data } = await axios({
    url: `https://${shop}/admin/api/${apiVersion}/graphql.json`,
    method: 'POST',
    data: buildQuery(topic, address),
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/graphql',
    },
  });

  return { success: isSuccess(data), result: data };
};

module.exports = { registerWebhook, validateWebhook };
