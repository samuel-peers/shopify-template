const fetch = require('node-fetch');
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
  const response = await fetch(
    `https://${shop}/admin/api/${apiVersion}/graphql.json`,
    {
      method: 'POST',
      body: buildQuery(topic, address),
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/graphql',
      },
    },
  );

  const result = await response.json();

  return { success: isSuccess(result), result };
};

module.exports = { registerWebhook, validateWebhook };
