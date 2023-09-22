const AWS = require("aws-sdk");
const iot = new AWS.Iot();
const CryptoJS = require("crypto-js");

const iotdata = new AWS.IotData({
  endpoint: "alciucqxncdzf-ats.iot.us-east-1.amazonaws.com",
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
  console.log ('messagePayload:', messagePayload)
  const params = {
    topic,
    payload: messagePayload,
    qos: '0',
  }
  console.log ('params:', params)

  const result = await publishMqtt(params)
  console.log ('result:', result)
  return result
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

const { IoTDataPlaneClient, PublishCommand } = require("@aws-sdk/client-iot-data-plane");
const clientIoT = new IoTDataPlaneClient({ region: "us-east-1" })
console.log('🚀 clientIoT', clientIoT)

const fnIoTMqttPublishCommand = async (params: {topic: string, payload: object}) => {
  try {
    console.log('🚀 START fnIoTMqttPublishCommand')
    
    let topic = params.topic
    console.log('🚀 topic: ', topic)
    
    let payload = params.payload
    console.log('🚀 payload: ', payload)
    
    let sendParams = {
      topic: topic,
      payload: JSON.stringify(payload),
      qos: '0'
    }
    console.log('🚀 sendParams: ', sendParams)
    
    const command = new PublishCommand(sendParams)
    console.log('🚀 command: ', command)

    const response = await clientIoT.send(command)
    console.log('🚀 response: ', response)

    return response
  } catch (error: any) {
    console.log('🚀 fnIoTMqttPublishCommand - error.stack: ', error.stack)
    throw error.stack
  }
}

export async function handler(event: any) {
  try {

    const jsb = {
      topic: "sdkv3/1",
      payload: {"att": 5}
    }
    
    const resp =  await fnIoTMqttPublishCommand(jsb)
    console.log('🚀 resp', resp)


    return false 

    
    const { name } = event;

    await createThing({ thingName: name });
    
    const { certificateArn, certificateId, certificatePem, keyPair } =
      await createCertificates({ setAsActive: true });

    const { PublicKey, PrivateKey } = keyPair;

    const certInfo = {
        'nameThinencryptedKeyg':name,
        'certificateArn':certificateArn,
        'certificateId':certificateId,
        'certificatePem':certificatePem,
        'publicKey':PublicKey,
        'privateKey':PrivateKey,
    }
    console.log ('certInfo', certInfo)

    const dataToEncrypt = JSON.stringify({ PublicKey, PrivateKey, certificatePem });
    console.log ('dataToEncrypt:', dataToEncrypt)
    // const POLICY_NAME = process.env.POLICY_NAME;

    // await attachPolicy({ policyName: POLICY_NAME, target: certificateArn });
    // await attachCertificates({ principal: certificateArn, thingName: name });

    // encrypt event using public key and publish
    const encryptedMessage = encryptKeyPair(dataToEncrypt, name);
    console.log ('encryptedMessage:', encryptedMessage)

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
