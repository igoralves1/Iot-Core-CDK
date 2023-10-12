'use strict'

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/preview/client/iot/

const { IoTClient, CreateKeysAndCertificateCommand } = require("@aws-sdk/client-iot")
const clientIoT = new IoTClient({ region: "us-east-1" })


// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-iot-data-plane/
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-iot-data-plane/classes/publishcommand.html
const { IoTDataPlaneClient, PublishCommand } = require("@aws-sdk/client-iot-data-plane")
const clientIoTDataPlane = new IoTDataPlaneClient ({ region: "us-east-1" })


const publishMQTT = async (params) => {
  try {
    const input = {
      topic: params.topic,
      payload: JSON.stringify(params.payload),
      qos:'0'
    }
    const command = new PublishCommand (input)
    const result = clientIoTDataPlane.send(command)
    return result
  } catch (error) {
    console.error(error.stack)
    throw error.stack
  }
}

const createCertificate = async () => {
  try {
    const command  = new CreateKeysAndCertificateCommand({setAsActive: true})
    const result = await clientIoT.send(command)
    return result
  } catch (error) {
    console.error(error.stack)
    throw error.stack
  }
}


module.exports.fnCreateCertificateV3 = async (event) => {
  
    try {
        console.log('fnCreateCertificateV3')
 
        const { certificateArn, certificateId, certificatePem, keyPair } = await createCertificate()
        const {'use strict'

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/preview/client/iot/

const { IoTClient, CreateKeysAndCertificateCommand } = require("@aws-sdk/client-iot")
const clientIoT = new IoTClient({ region: "us-east-1" })


// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-iot-data-plane/
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-iot-data-plane/classes/publishcommand.html
const { IoTDataPlaneClient, PublishCommand } = require("@aws-sdk/client-iot-data-plane")
const clientIoTDataPlane = new IoTDataPlaneClient ({ region: "us-east-1" })


const publishMQTT = async (params) => {
  try {
    const input = {
      topic: params.topic,
      payload: JSON.stringify(params.payload),
      qos:'0'
    }
    const command = new PublishCommand (input)
    const result = clientIoTDataPlane.send(command)
    return result
  } catch (error) {
    console.error(error.stack)
    throw error.stack
  }
}

const createCertificate = async () => {
  try {
    const command  = new CreateKeysAndCertificateCommand({setAsActive: true})
    const result = await clientIoT.send(command)
    return result
  } catch (error) {
    console.error(error.stack)
    throw error.stack
  }
}


module.exports.fnCreateCertificateV3 = async (event) => {
  
    try {
        console.log('fnCreateCertificateV3')
 
        const { certificateArn, certificateId, certificatePem, keyPair } = await createCertificate()
        const { PublicKey, PrivateKey } = keyPair

        const certInfo = {
            'certificateArn':certificateArn,
            'certificateId':certificateId,
            'certificatePem':certificatePem,
            'publicKey':PublicKey,
            'privateKey':PrivateKey,
        }
        console.log('certInfo:', certInfo)

        const mqttParams = {
            topic: 'result/1',
            payload: certInfo
        }
        const resp = await publishMQTT(mqttParams)
        console.log('resp:', resp)

        return true
    } catch (error) {
        console.log('error:', error)
    }
    
} PublicKey, PrivateKey } = keyPair

        const certInfo = {
            'certificateArn':certificateArn,
            'certificateId':certificateId,
            'certificatePem':certificatePem,
            'publicKey':PublicKey,
            'privateKey':PrivateKey,
        }
        console.log('certInfo:', certInfo)

        const mqttParams = {
            topic: 'result/1',
            payload: certInfo
        }
        const resp = await publishMQTT(mqttParams)
        console.log('resp:', resp)

        return true
    } catch (error) {
        console.log('error:', error)
    }
    
}
