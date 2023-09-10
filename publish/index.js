const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: '',
  secretAccessKey: '',
  region: '',
});

const iotdata = new AWS.IotData({ endpoint: '' });

const topic = 'test/1';

const messagePayload = JSON.stringify({ result: 'abc' });

const params = {
  topic,
  payload: messagePayload,
  qos: 1,
};

iotdata.publish(params, (err, data) => {
  if (err) {
    console.error('Error publishing message:', err);
  } else {
    console.log('Message published:', data);
  }
});