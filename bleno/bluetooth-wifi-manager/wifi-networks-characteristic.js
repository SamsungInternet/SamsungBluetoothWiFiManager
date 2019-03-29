/**
 * Created by nherriot on 06/06/18.
 */


var util = require('util');
var bleno = require('bleno');
const wifi = require('./wifi-controller');
var BlenoCharacteristic = bleno.Characteristic;

const constants = require('./config/constants');


var NetworkCharacteristic = function() {
  NetworkCharacteristic.super_.call(this, {
    uuid: constants.WIFI_SSIDS_LIST_UUID,
    properties: ['read', 'write', 'notify'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'The currently visible network names'
      })
    ],
    value: null
  });

  let networksArray = Array.from(wifi.wifiService.networks).join(',');
  console.log('wifi networks characteristics network array is: ' + networksArray);
  this._value = new Buffer.from(networksArray);
  this._updateValueCallback = null;
};


util.inherits(NetworkCharacteristic, BlenoCharacteristic);



NetworkCharacteristic.prototype.onReadRequest = function(offset, callback) {
  var result = this.RESULT_SUCCESS;

  // wifi manager stores network SSID's as a set to stop duplicate entries. so we need to convert back to an Array before comparing with our stale buffer value
  // in our _value variable.
  var networksArray = Array.from(wifi.wifiService.networks).join(',');
  console.log('NetworkCharacteristic onReadRequest - typeof _value is:' + typeof this._value);
  console.log('NetworkCharacteristic onReadRequest - typeof networksArray is:' + typeof networksArray);

  if (this._value != networksArray) {
    console.log('WARNING! NetworkCharacteristic state is: ' + this._value + ' but the wifi manager has it as: ' + networksArray + ' updating BLE values');
    this._value = networksArray;
  }

  // Take our objects local variable _value and pass into a buffer to be used by the bluetooth stack. _value should be our list of network SSID values
  var data = new Buffer(this._value.toString('hex'), 'utf-8');
  console.log('Network Characteristic - data buffer is: ' + data);
  console.log('Network Characteristic - data length is: ' + data.length);
  // currently the bluetooth stack ingests about 22 octets at a time. if we have not ingested all our octets we should return success and take 22 away from
  // the start of our buffer. The 'offset' value is the amount of octets we have already sent.
  if (offset > data.length) {
    result = this.RESULT_INVALID_OFFSET;
  }  else {
    data = data.slice(offset);
  }

  console.log('Network Characteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(result, data);
};



NetworkCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('Network Characteristic - onWriteRequest: value = ' + this._value);

  if (this._updateValueCallback) {
    console.log('Network Characteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};


NetworkCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('Network Characteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};



NetworkCharacteristic.prototype.onUnsubscribe = function() {
  console.log('Network Characteristic - onUnsubscribe');

  this._updateValueCallback = null;
};


module.exports = NetworkCharacteristic;