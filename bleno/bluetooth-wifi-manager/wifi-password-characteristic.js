/**
 * Created by nherriot on 06/06/18.
 */

/**
 * Created by nherriot on 05/06/18.
 */

var util = require('util');
var bleno = require('bleno');
var BlenoCharacteristic = bleno.Characteristic;

const constants = require('./constants');


var WiFiPasswordCharacteristic = function() {
  WiFiPasswordCharacteristic.super_.call(this, {
    uuid: constants.WIFI_PASSWORD_UUID,
    properties: ['write'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'The password you wish to set for the WiFi network'
      })
    ],
    value: null
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(WiFiPasswordCharacteristic, BlenoCharacteristic);


WiFiPasswordCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('WiFi Password Characteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};


WiFiPasswordCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('WiFi Password Characteristic - onWriteRequest: value = ' + this._value);

  if (this._updateValueCallback) {
    console.log('WiFi Password Characteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};


WiFiPasswordCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('WiFi Password Characteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

WiFiPasswordCharacteristic.prototype.onUnsubscribe = function() {
  console.log('WiFi Password Characteristic - onUnsubscribe');

  this._updateValueCallback = null;
};


module.exports = WiFiPasswordCharacteristic;
