var request = require('request');

var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://192.168.2.31');
var topicName = 'timeseries';
 
client.on('connect', function () {
  client.subscribe(topicName, function (error, granted) {
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
  console.log('topic:', topic.toString());

  postTimeseries(message);
});

// Address of InfluxDB server.
var dbURL = 'http://192.168.2.31:8086/write';
function postTimeseries(message) {

  var options = {
    url: dbURL,
    qs: {
      db: 'mydb'
    },
    body: message
  };

  var timestamp = parseTimestamp(message.toString());

  if (timestamp.hasValue) {
    options.qs.precision = timestamp.timestamp;
  }

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

/*
  Typical message format:
  "mymeas,mytag=1 myfield=92 1463683089600"

  Note:
  - tags and fields are strictly positional
  - how field separators are spaces between column types and 
    commas between column-type instances
*/
function parseTimestamp(message) {
  var timestamp = {};
  var parts = message.split(' ');
  var lastPart = parseInt(parts[parts.length - 1]);
  if (lastPart > 0) {
    timestamp.hasValue = true;
    timestamp.timestamp = getTimestampPrecision(lastPart);
  } else {
    timestamp.hasValue = false;
  }
  return timestamp;
}

/*
  Possible return values defined from 'duration literals':
  https://docs.influxdata.com/influxdb/v1.7/query_language/spec/#durations

  Ignored values include: 'm', 'h', 'd', 'w'
*/
function getTimestampPrecision(timestamp) {
  switch (parseInt(timestamp.toExponential().split('+')[1])) {
    case 9:
      return 's';
    case 12:
      return 'ms';
    case 15:
      return 'u';
    case 18:
      return 'ns';
    default:
     // TODO: handle gracefully
  }
}
