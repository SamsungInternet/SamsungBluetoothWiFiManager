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


var NetworkCharacteristic = function() {
  NetworkCharacteristic.super_.call(this, {
    uuid: constants.WIFI_SIDDS_LIST_UUID,
    properties: ['read', 'write', 'notify'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'The currently visible network names'
      })
    ],
    value: null
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};


util.inherits(NetworkCharacteristic, BlenoCharacteristic);



NetworkCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('Network Characteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
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