const AWS = require("aws-sdk");
// lambda/my-lambda.ts

const publishData = (topic: string, payload: object) => {
  const iotdata = new AWS.IotData({
    endpoint: "alciucqxncdzf-ats.iot.us-east-2.amazonaws.com",
  });

  const messagePayload = JSON.stringify(payload);

  const params = {
    topic,
    payload: messagePayload,
    qos: 1,
  };

  return new Promise((resolve, reject) => {
    iotdata.publish(params, (err: any, data: object) => {
      if (err) {
        reject(err);
      } else {
        resolve(data)
      }
    });
  })
}

export async function handler (event: any)  {
  try{
    AWS.config.update({
      accessKeyId: "AKIA6P5FPAIKCC73NKW4",
      secretAccessKey: "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",
      region: "us-east-2",
    });

    console.log('event -> ', event)

    const result = await publishData("result/1", { result: "success" });

    console.log('result -> ', result)

    const response = {
      statusCode: 200,
      body: JSON.stringify("Hello from Lambda!"),
    };

    return response;

  } catch(err){
    console.log('err handler -> ', err)
    const response = {
      statusCode: 500,
      error: err
    };

    return response;
  } 
};
