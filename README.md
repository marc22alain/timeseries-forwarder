"timestamp,light,humidity,temp"
time: timestamp

fields: light, humidity, temp

tags: location, plant, plant_id, sensor_package, experiment_name (is even more meta)

subsciber as bridge MQTT=>HTTPS: @ https://www.npmjs.com/package/mqtt

