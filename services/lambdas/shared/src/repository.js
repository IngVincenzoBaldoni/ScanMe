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
  createdAt: item.createdAt,
  commerce: {
    salesChannel: item.salesChannel ?? "manual",
    orderReference: item.orderReference ?? "N/A",
    customerName: item.customerName ?? "Non assegnato",
    customerEmail: item.customerEmail ?? "n/a@scanme.local",
    requestedUrl: item.requestedUrl ?? item.targetUrl ?? "https://example.com"
  },
  product: {
    model: item.productModel ?? "Legacy twin",
    size: item.productSize ?? "N/A",
    color: item.productColor ?? "N/A",
    placement: item.printPlacement ?? "Back",
    printProvider: item.printProvider ?? "Manual"
  },
  operations: {
    productionStatus: item.productionStatus ?? "draft",
    notes: item.operationsNotes ?? ""
  },
  analytics: {
    totalScans: item.scanCount ?? 0,
    lastScannedAt: item.lastScannedAt,
    dailyScans: Object.entries(item.dailyScans ?? {})
      .map(([date, count]) => ({
        date,
        count
      }))
      .sort((left, right) => left.date.localeCompare(right.date))
  }
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

const createShirt = async ({
  shirtId,
  label,
  targetUrl,
  commerce,
  product,
  operations
}) => {
  const timestamp = nowIso();
  const item = {
    pk: `SHIRT#${shirtId}`,
    sk: "PROFILE",
    shirtId,
    label,
    targetUrl,
    salesChannel: commerce.salesChannel,
    orderReference: commerce.orderReference,
    customerName: commerce.customerName,
    customerEmail: commerce.customerEmail,
    requestedUrl: commerce.requestedUrl,
    productModel: product.model,
    productSize: product.size,
    productColor: product.color,
    printPlacement: product.placement,
    printProvider: product.printProvider,
    productionStatus: operations.productionStatus,
    operationsNotes: operations.notes,
    createdAt: timestamp,
    updatedAt: timestamp,
    scanCount: 0,
    dailyScans: {}
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

const recordScan = async (shirt) => {
  const timestamp = nowIso();
  const dayKey = timestamp.slice(0, 10);
  const nextDailyScans = {
    ...(shirt.dailyScans ?? {}),
    [dayKey]: (shirt.dailyScans?.[dayKey] ?? 0) + 1
  };

  await client.send(
    new UpdateCommand({
      TableName: tableName,
      Key: {
        pk: `SHIRT#${shirt.shirtId}`,
        sk: "PROFILE"
      },
      UpdateExpression:
        "SET scanCount = :scanCount, lastScannedAt = :lastScannedAt, dailyScans = :dailyScans",
      ExpressionAttributeValues: {
        ":scanCount": (shirt.scanCount ?? 0) + 1,
        ":lastScannedAt": timestamp,
        ":dailyScans": nextDailyScans
      }
    })
  );
};

module.exports = {
  getShirtById,
  listShirts,
  createShirt,
  updateTargetUrl,
  recordScan
};
