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

  //this._value = new Buffer(0);
  this._value = new Buffer.from(wifi.wifiService.wifiSSID);
  this._updateValueCallback = null;
};


util.inherits(ActiveSIDDCharacteristic, BlenoCharacteristic);



ActiveSIDDCharacteristic.prototype.onReadRequest = function(offset, callback) {
  //console.log('Active SIDD Characteristic - onReadRequest: value = ' + this._value.toString('hex'));
  console.log('Active SIDD Characteristic - onReadRequest: value = ' + wifi.wifiService.wifiSSID);

  callback(this.RESULT_SUCCESS, this._value);
};



ActiveSIDDCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('Active SIDD Characteristic - onWriteRequest: value = ' + this._value);

  if (this._updateValueCallback) {
    console.log('Active SIDD Characteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
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