/**
 * Created by nherriot on 06/06/18.
 */


var util = require('util');
var bleno = require('bleno');
const wifi = require('./wifi-controller');
var BlenoCharacteristic = bleno.Characteristic;

const constants = require('./constants');


var WiFiSecurityCharacteristic = function() {
  WiFiSecurityCharacteristic.super_.call(this, {
    uuid: constants.WIFI_SECURITY_UUID,
    properties: ['read'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'This is a list of encryption settings you can set for your WiFi network. e.g. WEP, LEAP, WPA 128bit....'
      })
    ],
    value: null
  });

  var myEnc = JSON.stringify(constants.WiFiEncryptionValues.security);
  this._value = new Buffer.from(myEnc);
  //this._value = '["NONE","WEP 128b ASCii","WEP 128b Pasephrase","LEAP","WEP","WPA2 Personal","WPA2 Enterprise"]';
  console.log("Encryption is :  " + this._value);
  this._updateValueCallback = null;
};

util.inherits(WiFiSecurityCharacteristic, BlenoCharacteristic);


WiFiSecurityCharacteristic.prototype.onReadRequest = function(offset, callback) {
  var result = this.RESULT_SUCCESS;

  //console.log('offset is : ' + offset);
  // Take our objects local variable _value and pass into a buffer to be used by the bluetooth stack. _value should be our list of encryption types for wifi
  var data = new Buffer(this._value, 'utf-8');
  // currently the bluetooth stack ingests about 22 octets at a time. if we have not ingested all our octets we should return success and take 22 away from
  // the start of our buffer. The 'offset' value is the amount of octets we have already sent.
  if (offset > data.length) {
    result = this.RESULT_INVALID_OFFSET;
  } else {
    data = data.slice(offset);
  }
  callback(result, data);           // this calls the dynamic function 'callback' passed into our onReadRequest which will send our buffer over the wire.
};


WiFiSecurityCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('WiFi Encryption Characteristic - onWriteRequest: value = ' + this._value);

  if (this._updateValueCallback) {
    console.log('WiFi Encryption Characteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};


WiFiSecurityCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('WiFi Encryption Characteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

WiFiSecurityCharacteristic.prototype.onUnsubscribe = function() {
  console.log('WiFi Encryption Characteristic - onUnsubscribe');

  this._updateValueCallback = null;
};


module.exports = WiFiSecurityCharacteristic;
