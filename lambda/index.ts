const AWS = require("aws-sdk");
const iot = new AWS.Iot();
const CryptoJS = require("crypto-js");

const iotdata = new AWS.IotData({
  endpoint: "a36pdun6sfz528-ats.iot.ap-south-1.amazonaws.com",
});


const publishMqtt = (params: any) =>
  new Promise((resolve, reject) =>
    iotdata.publish(params, (err: any, res: any) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    })
  );

const publishData = async (topic: string, payload: object) => {
  const messagePayload = JSON.stringify(payload);

  const params = {
    topic,
    payload: messagePayload,
    qos: '0',
  };

  const result = await publishMqtt(params);
  return result;
};

const createCertificates = (params: any): Promise<any> =>
  new Promise((resolve, reject) =>
    iot.createKeysAndCertificate(params, (err: any, res: any) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  );

const attachPolicy = (params: any) =>
  new Promise((resolve, reject) =>
    iot.attachPolicy(params, (err: any, res: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  );

const attachCertificates = (params: any) =>
  new Promise((resolve, reject) =>
    iot.attachThingPrincipal(params, (err: any, res: any) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  );

const createThing = (params: any) => {
  return new Promise((resolve, reject) => {
    iot.createThing(params, (err: any, res: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

const encryptKeyPair = (dataToEncrypt: string, key: string) => {
  return CryptoJS.AES.encrypt(dataToEncrypt, key).toString();
};

export async function handler(event: any, context: any, callback: any) {
  try {
    const { name } = event;

    await createThing({ thingName: name });
    
    const { certificateArn, certificatePem, keyPair } =
      await createCertificates({ setAsActive: true });

    const { PublicKey, PrivateKey } = keyPair;

    const dataToEncrypt = JSON.stringify({ PublicKey, PrivateKey, certificatePem });

    const POLICY_NAME = process.env.POLICY_NAME;

    await attachPolicy({ policyName: POLICY_NAME, target: certificateArn });
    await attachCertificates({ principal: certificateArn, thingName: name });

    // encrypt event using public key and publish
    const encryptedMessage = encryptKeyPair(dataToEncrypt, PublicKey);

    const result = await publishData('result/1', { encryptedKey: encryptedMessage });

    return {
      statusCode: 200,
      body: result,
    };
  } catch (err) {
    console.log('error', err);
    const response = {
      statusCode: 500,
      error: err,
    };
    return response;
  }
}
