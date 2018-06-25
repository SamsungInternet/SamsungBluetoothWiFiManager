/**
 * Created by nherriot on 06/06/18.
 */

var util = require('util');
var bleno = require('bleno');
const wifi = require('./wifi-controller');
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

  // There is no reading of 'password' data so we can leave this blank on object creation
  this._value = new Buffer(0);
  this._updateValueCallback = null;
};


util.inherits(WiFiPasswordCharacteristic, BlenoCharacteristic);


WiFiPasswordCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('WiFi Password Characteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};


WiFiPasswordCharacteristic.prototype.onWriteRequest = function(passwordData, offset, withoutResponse, callback) {
  let result = this.RESULT_SUCCESS;
  console.log('onWriteRequest password data -> ' + passwordData); // TODO Remove this log after testing!!!!

  if(wifi.wifiService.checkPassword(passwordData)) {
    wifi.wifiService.connect(passwordData).then( (state) => {
      console.log('WiFi Characteristics connecting to wifi network. State: ' + state);

      if (state =='success'){
        console.log('onWriteRequest connected to wifi network - SUCCESS');
      } else {
        console.log('onWriteRequest connected to wifi network - FAILED');
        result = this.RESULT_UNLIKELY_ERROR;
      }

      if (this._updateValueCallback) {
        console.log('WiFi Password Characteristic - onWriteRequest: notifying');

        this._updateValueCallback(this._value);
      }

      callback(result);

    });
  }




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
