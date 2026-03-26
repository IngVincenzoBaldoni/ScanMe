const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
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
  targetUrl: item.targetUrl,
  updatedAt: item.updatedAt,
  createdAt: item.createdAt
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

const listShirts = async () => {
  const response = await client.send(
    new ScanCommand({
      TableName: tableName,
      FilterExpression: "begins_with(pk, :pkPrefix) AND sk = :sk",
      ExpressionAttributeValues: {
        ":pkPrefix": "SHIRT#",
        ":sk": "PROFILE"
      }
    })
  );

  return (response.Items ?? []).map(buildShirtResponse).sort((a, b) => {
    return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
  });
};

const createShirt = async ({ shirtId, label, targetUrl }) => {
  const timestamp = nowIso();
  const item = {
    pk: `SHIRT#${shirtId}`,
    sk: "PROFILE",
    shirtId,
    label,
    targetUrl,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  await client.send(
    new PutCommand({
      TableName: tableName,
      Item: item,
      ConditionExpression: "attribute_not_exists(pk)"
    })
  );

  return buildShirtResponse(item);
};

const updateTargetUrl = async ({ shirtId, targetUrl }) => {
  const timestamp = nowIso();

  const response = await client.send(
    new UpdateCommand({
      TableName: tableName,
      Key: {
        pk: `SHIRT#${shirtId}`,
        sk: "PROFILE"
      },
      ConditionExpression: "attribute_exists(pk)",
      UpdateExpression: "SET targetUrl = :targetUrl, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":targetUrl": targetUrl,
        ":updatedAt": timestamp
      },
      ReturnValues: "ALL_NEW"
    })
  );

  return buildShirtResponse(response.Attributes);
};

module.exports = {
  getShirtById,
  listShirts,
  createShirt,
  updateTargetUrl
};
