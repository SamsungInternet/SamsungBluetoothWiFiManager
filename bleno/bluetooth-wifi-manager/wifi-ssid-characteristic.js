/**
 * Created by nherriot on 05/06/18.
 */

var util = require('util');
var bleno = require('bleno');
const wifi = require('./wifi-controller');
var BlenoCharacteristic = bleno.Characteristic;

const constants = require('./constants');


var ActiveSIDDCharacteristic = function() {
  ActiveSIDDCharacteristic.super_.call(this, {
    uuid: constants.WIFI_SSID_UUID,
    properties: ['read', 'write', 'notify'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'The current WiFi SIDD name'
      })
    ],
    value: null
  });

  // we need to load our wifi SSID from the wifiService object when creating our bluetooth characteristic
  this._value = new Buffer.from(wifi.wifiService.wifiSSID);
  this._updateValueCallback = null;
};


util.inherits(ActiveSIDDCharacteristic, BlenoCharacteristic);


ActiveSIDDCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('Active SIDD Characteristic - onReadRequest: value = ' + wifi.wifiService.wifiSSID);

  callback(this.RESULT_SUCCESS, this._value);
};


ActiveSIDDCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  let result = this.RESULT_SUCCESS;
  console.log('onWriteRequest SSID data -> ' + data);

  if (wifi.wifiService.setSSID(data)) {
    this._value = data;
    console.log('Active SIDD Characteristic - onWriteRequest: value = ' + this._value);
  } else {
    console.error('The SSID value is illegal. Tried setting: ' + data);
    result = this.RESULT_UNLIKELY_ERROR;
  }

  if (this._updateValueCallback) {
    console.log('Active SIDD Characteristic - onWriteRequest: notifying');
    this._updateValueCallback(this._value);
  }
  callback(result);
};


ActiveSIDDCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('Active SIDD Characteristic - onSubscribe');
  this._updateValueCallback = updateValueCallback;
};


ActiveSIDDCharacteristic.prototype.onUnsubscribe = function() {
  console.log('Active SIDD Characteristic - onUnsubscribe');
  this._updateValueCallback = null;
};


module.exports = ActiveSIDDCharacteristic;