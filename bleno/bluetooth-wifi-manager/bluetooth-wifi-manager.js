/**
 * Created by nherriot on 06/06/18.
 */

const bleno = require("bleno");
const constants = require('./constants');
const wifi = require('./wifi-controller');

console.log(`Wifi encryption values are: ${constants.WiFiEncryptionValues.security}`);

var BlenoPrimaryService = bleno.PrimaryService;

var WifiSIDDCharacteristic = require('./wifi-ssid-characteristic');
var WiFiPasswordCharacteristic = require('./wifi-password-characteristic');
var WiFiSecurityCharacteristic = require('./wifi-security-characteristic');
var NetworkCharacteristic = require('./wifi-networks-characteristic');

console.log('bleno - Bluetooth WiFi Manager');
var ssid = wifi.wifiService.getSSID();
console.log(`wifi siid is: ${ssid}`);

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising(constants.BLUETOOTH_SERVICE_NAME, [constants.WIFI_SETUP_SERVICE_UUID] );
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
        uuid: constants.WIFI_SETUP_SERVICE_UUID,
        characteristics: [
          new WifiSIDDCharacteristic(),
          new WiFiPasswordCharacteristic(),
          new WiFiSecurityCharacteristic(),
          new NetworkCharacteristic()
        ]
      })
    ]);
  }
});