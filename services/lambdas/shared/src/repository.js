const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand
} = require("@aws-sdk/lib-dynamodb");

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const tableName = process.env.LINKS_TABLE_NAME;

if (!tableName) {
  throw new Error("LINKS_TABLE_NAME non configurata.");
}

const nowIso = () => new Date().toISOString();

const buildShirtResponse = (item) => ({
  shirtId: item.shirtId,
  label: item.label,
  activationCode: item.activationCode,
  ownerUserId: item.ownerUserId,
  targetUrl: item.targetUrl,
  updatedAt: item.updatedAt,
  claimedAt: item.claimedAt,
  status: item.ownerUserId ? "claimed" : "unclaimed"
});

const getShirtById = async (shirtId) => {
  const response = await client.send(
    new GetCommand({
      TableName: tableName,
      Key: {
        pk: `SHIRT#${shirtId}`,
        sk: "PROFILE"
      }
    })
  );

  return response.Item ?? null;
};

const getShirtByActivationCode = async (activationCode) => {
  const response = await client.send(
    new QueryCommand({
      TableName: tableName,
      IndexName: "gsi1",
      KeyConditionExpression: "gsi1pk = :gsi1pk AND gsi1sk = :gsi1sk",
      ExpressionAttributeValues: {
        ":gsi1pk": `ACTIVATION#${activationCode}`,
        ":gsi1sk": "PROFILE"
      },
      Limit: 1
    })
  );

  return response.Items?.[0] ?? null;
};

const listShirtsByOwner = async (ownerUserId) => {
  const response = await client.send(
    new QueryCommand({
      TableName: tableName,
      IndexName: "gsi1",
      KeyConditionExpression: "gsi1pk = :gsi1pk",
      ExpressionAttributeValues: {
        ":gsi1pk": `OWNER#${ownerUserId}`
      }
    })
  );

  return (response.Items ?? []).map(buildShirtResponse);
};

const claimShirt = async ({ shirtId, ownerUserId }) => {
  const timestamp = nowIso();

  const response = await client.send(
    new UpdateCommand({
      TableName: tableName,
      Key: {
        pk: `SHIRT#${shirtId}`,
        sk: "PROFILE"
      },
      ConditionExpression: "attribute_not_exists(ownerUserId)",
      UpdateExpression:
        "SET ownerUserId = :ownerUserId, claimedAt = :claimedAt, updatedAt = :updatedAt, gsi1pk = :gsi1pk, gsi1sk = :gsi1sk",
      ExpressionAttributeValues: {
        ":ownerUserId": ownerUserId,
        ":claimedAt": timestamp,
        ":updatedAt": timestamp,
        ":gsi1pk": `OWNER#${ownerUserId}`,
        ":gsi1sk": `SHIRT#${shirtId}`
      },
      ReturnValues: "ALL_NEW"
    })
  );

  return buildShirtResponse(response.Attributes);
};

const updateTargetUrl = async ({ shirtId, ownerUserId, targetUrl }) => {
  const timestamp = nowIso();

  const response = await client.send(
    new UpdateCommand({
      TableName: tableName,
      Key: {
        pk: `SHIRT#${shirtId}`,
        sk: "PROFILE"
      },
      ConditionExpression: "ownerUserId = :ownerUserId",
      UpdateExpression: "SET targetUrl = :targetUrl, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":ownerUserId": ownerUserId,
        ":targetUrl": targetUrl,
        ":updatedAt": timestamp
      },
      ReturnValues: "ALL_NEW"
    })
  );

  return buildShirtResponse(response.Attributes);
};

const seedPlaceholderShirt = async ({ shirtId, activationCode, label }) => {
  const timestamp = nowIso();

  await client.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        pk: `SHIRT#${shirtId}`,
        sk: "PROFILE",
        shirtId,
        label,
        activationCode,
        gsi1pk: `ACTIVATION#${activationCode}`,
        gsi1sk: "PROFILE",
        createdAt: timestamp,
        updatedAt: timestamp
      },
      ConditionExpression: "attribute_not_exists(pk)"
    })
  );
};

module.exports = {
  getShirtByActivationCode,
  getShirtById,
  listShirtsByOwner,
  claimShirt,
  updateTargetUrl,
  seedPlaceholderShirt
};
