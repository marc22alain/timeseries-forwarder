var request = require('request');

var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://192.168.2.31');
 
client.on('connect', function () {
  client.subscribe('presence', function (error, granted) {
    if (error) {
      console.log('error:', error);
    } else {
      console.log('Subscription SUCCESS!', granted);
    }
  })
});
 
client.on('message', function (topic, message) {
  // message is Buffer
  console.log('message:', message.toString());
  // client.end()
  console.log('topic:', topic.toString());
  // TODO: filter for `topic === 'timeseries'`
  if (true) {
    postTimeseries(message);
  }
});


var dbURL = 'http://192.168.2.31:8086/write';
function postTimeseries(message) {

  var options = {
    url: dbURL,
    qs: {
      db: 'mydb'
      // TODO: handle precision when message includes a timestamp
      // precision: parseTimestamp(message)
    },
    body: message
  };

  request.post(options, function(error, response){
    if (error) {
      console.log('error: ', error);
    } else if (response.statusCode >= 400) {
      console.log('bad request: ', response.statusCode);
      console.log('issue: ', response.body);
      // console.log('request: ', response.request);
      console.log('qs: ', response.request._qs);
    } else {
      // Should be 204.
      console.log('congrats:', response.statusCode);
    }
  })
}
