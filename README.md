# Timeseries-Forwarder

This is an [**MQTT**](http://mqtt.org) client that subscribes to the **timeseries** topic, and forwards received messages to an [**InfluxDB**](https://docs.influxdata.com/influxdb/v1.7/) instance.

## How to use

ATM, the host and port for the MQTT broker and the InfluxDB instance are hard-coded. You'll want to update according to your needs.

## Dependencies

[mqtt library](https://www.npmjs.com/package/mqtt)
