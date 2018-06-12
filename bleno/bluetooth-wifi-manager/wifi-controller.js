/**
 * Created by nherriot on 12/06/18.
 */

var piWifi = require('pi-wifi');

var networkDetails = {
  ssid: 'MyNetwork',
  username: 'demo',
  password: 'swordfish'
};


// This will list the networks currently defined in the wpa config file.
piWifi.listNetworks(function(err, networksArray) {
  if (err) {
    return console.error(err.message);
  }
  console.log(networksArray);
});

// =>
// [{ network_id: 0, ssid: 'MyNetwork', bssid: 'any', flags: '[DISABLED]' },
// { network_id: 1, ssid: 'Skynet', bssid: 'any', flags: '[CURRENT]' }]




// This will provide a json network of all scanned wifi addresses
piWifi.scan(function(err, networks) {
  if (err) {
    return console.error(err.message);
  }
  console.log(networks);
});

// =>
//[
//  { bssid: 'aa:bb:cc:dd:ee:ff',
//    frequency: 2462,
//    signalLevel: -40,
//    flags: '[WPA2-PSK-CCMP][WPS][ESS]',
//    ssid: 'MyNetwork' },
//  { bssid: '11:22:33:44:55:66',
//    frequency: 2462,
//    signalLevel: -28,
//    flags: '[WPA2-PSK-CCMP][ESS]',
//    ssid: 'AnotherNetwork' },
//  { bssid: 'aa:11:bb:22:cc:33',
//    frequency: 2462,
//    signalLevel: -33,
//    flags: '[WPA2-EAP-CCMP-preauth][WPS][ESS]',
//    ssid: 'MyEnterpriseNetwork' },
//  { bssid: 'c0:56:27:44:3b:9c',
//    frequency: 2412,
//    signalLevel: -59,
//    flags: '[WPA-PSK-CCMP+TKIP][WPA2-PSK-CCMP+TKIP][ESS]',
//    ssid: 'MyGuestsNetwork'
//  }
//]




piWifi.status('wlan0', function(err, status) {
  if (err) {
    return console.error(err.message);
  }
  console.log(status);
});

// =>
//{
//  bssid: '2c:f5:d3:02:ea:d9',
//  frequency: 2412,
//  mode: 'station',
//  key_mgmt: 'wpa2-psk',
//  ssid: 'MyNetwork',
//  pairwise_cipher: 'CCMP',
//  group_cipher: 'CCMP',
//  p2p_device_address: 'aa:bb:cc:dd:ee:ff',
//  wpa_state: 'COMPLETED',
//  ip: '10.20.30.40',
//  mac: 'a1:b2:c3:d4:e5:f6',
//  uuid: 'e1cda789-8c88-53e8-ffff-31c304580c22',
//  id: 0
//}