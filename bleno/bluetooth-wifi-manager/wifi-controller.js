/**
 * Created by nherriot on 12/06/18.
 */

var piWifi = require('pi-wifi');
const config = require('config');

const wifiService = new WiFiServiceDiscovery();


// First create a promise which will wait some time before returning.
// Here we add a delay by using the setTimeout function. Our Promise gets
// resolved after 2 seconds and is loged out to the screen at line 41.
// But what happens if we want to have one thing depend on the other ?
function doubleAfter2Seconds(x) {
  return new Promise(resolve => {
    setTimeout(() => {resolve("complete");}, x*1000);
  });
}

// This wraps the piWifi status method in a promise to allow it to be used with an async/await call
function getpiWifiStatus() {
  return new Promise( (resolve, reject) => {
      piWifi.status('wlan0', function (err, status) {
        if (err) {
          console.error(err.message);
          reject (err.message);
        } else {
          console.log('init complete: ' + status.ssid);
          resolve (status);
        }
      });
  });
}

// This wraps the piWifi scan method in a promise to allow it to be used with an async/await call
function getpiNetworkSIDDs () {
  return new Promise((resolve, reject) => {
      piWifi.scan(function (err, networks) {
      networkSidds = []
      if (err) {
        console.error(err.message);
        reject(err.message);
      } else {
        console.log('*** Scan WiFi networks:');
        for (i = 0; i < networks.length; i++) {
          console.log(networks[i].ssid);
          networkSidds.push(networks[i]);
        }
        resolve(networkSidds);
      }
    });
  });
}


function WiFiServiceDiscovery () {
  this.status = 'inactive';
  this.wifiSSID = config.get('defaultWiFi.activeSSID');
  this.ip = config.get('defaultWiFi.ip');
  this.mac = config.get('defaultWiFi.mac');
  this.securitCharacteristic = config.get('defaultWiFi.securityCharacteristic');
  this.status = 'inactive';
  this.networks = [];
}

WiFiServiceDiscovery.prototype.getStatus = async function() {
  let status = await getpiWifiStatus();
  this.wifiSSID = status.ssid;
  this.securitCharacteristic = status.key_mgmt;
  this.ip = status.ip;
  this.mac = status.mac;
  this.status = 'active';
	return this.status;

}

WiFiServiceDiscovery.prototype.getNetworkSIDDs = async function() {
  let networks = await getpiNetworkSIDDs();
  this.networks = networks;
  return this.networks;
}

WiFiServiceDiscovery.prototype.getSSID = function(){
  // Return the SSID that is currently set
  console.log(`Getting default SSID: ${this.wifiSSID}`);
  return this.wifiSSID;

};


wifiService.getSSID();
wifiService.getStatus().then( (state) => {
  console.log(' The object state is: ' + state);
});

wifiService.getNetworkSIDDs().then( (networks) => {
  console.log(' The network sidds are: ' + networks);
});



// This will list the networks currently defined in the wpa config file.
piWifi.listNetworks(function(err, networksArray) {
  if (err) {
    return console.error(err.message);
  }
  console.log('*** List networks:')
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
  console.log('*** Scan WiFi networks:');
  for (i=0; i< networks.length; i++) {
    console.log(networks[i].ssid);

  }
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




// piWifi.status('wlan0', function(err, status) {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log('*** Status of WiFi Network:');
//   console.log(status.ssid);
// });

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




module.exports = {
  wifiService: wifiService,
};
