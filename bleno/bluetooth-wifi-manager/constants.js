/**
 * Created by nherriot on 06/06/18.
 */


const WIFI_SETUP_SERVICE_UUID = '00010000-89BD-43C8-9231-40F6E305F96D';
const WIFI_SSID_UUID = '00010001-89BD-43C8-9231-40F6E305F96D';                //
const WIFI_PASSWORD_UUID = '00010002-89BD-43C8-9231-40F6E305F96D';            //
const WIFI_SECURITY_UUID = '00010003-89BD-43C8-9231-40F6E305F96D';            //
const WIFI_SIDDS_LIST_UUID = '00010004-89BD-43C8-9231-40F6E305F96D';          //
const BLUETOOTH_SERVICE_NAME = 'IoT Gateway WiFi Setup';

var WiFiSecurity = {
  NONE:    0,
  WEP_128_ASCI: 1,
  WEP_128_PASEPHRASE: 2,
  LEAP: 3,
  WEP: 4,
  WPA2_PERSONAL: 5,
  WPA2_ENTERPRIZE: 6,
};

var WiFiEncryptionValues = {
"name":BLUETOOTH_SERVICE_NAME,
"active":"none",
"security":[ "NONE", "WEP 128b ASCii", "WEP 128b Pasephrase", "LEAP", "WEP", "WPA2 Personal", "WPA2 Enterprise" ]
};


module.exports.WIFI_SETUP_SERVICE_UUID = WIFI_SETUP_SERVICE_UUID;
module.exports.WIFI_SSID_UUID = WIFI_SSID_UUID;
module.exports.WIFI_PASSWORD_UUID = WIFI_PASSWORD_UUID;
module.exports.WIFI_SECURITY_UUID = WIFI_SECURITY_UUID;
module.exports.WIFI_SIDDS_LIST_UUID = WIFI_SIDDS_LIST_UUID;
module.exports.BLUETOOTH_SERVICE_NAME = BLUETOOTH_SERVICE_NAME;
module.exports.WiFiSecurity = WiFiSecurity;
module.exports.WiFiEncryptionValues = WiFiEncryptionValues;