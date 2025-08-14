import AWS from 'aws-sdk';




const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
});

export async function getRecordFromDynamoDB(id: string) {
    const result = await dynamoDb.get({
      TableName: process.env.DYNAMO_TABLE!,
      Key: {
        CompanyNumber: id, // ✅ Match table key
      },
    }).promise();
  
   
    return result.Item || null;
  }