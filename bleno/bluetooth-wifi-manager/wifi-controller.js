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


function validateNonEmpty(inputField) {
  // See if the input value contains any text
  if (inputField.value.length == 0) {
    return false;
    } else {
  // The data is present, but may not be correct!
    return true;
  }
}


function validateLength(inputField, minLength, maxLength) {
  // Make sure the input value contains at least the maxiumum or minimum number of characters
  if (inputField.length < minLength || inputField.length > maxLength) {
    return false;
  } else {
    // The data is OK, so clear the help message
    return true;
  }
}


function validatePassword(inputField) {
  // Make sure the password is within certain boundaries
  // TODO Add a good password validation library here. For now make sure it is at least 8 chars and less than 32
  return validateLength(inputField, 8, 32);
}


function validateRegEx(regex, inputStr) {
  // See if the inputStr data validates OK

  if (!regex.test(inputStr)) {
      // The data is invalid, so set the help message and return false
      return false;
  } else {
      // The data is OK, so clear the help message and return true
      return true;
  }
}


function validateSSID(inputField) {
  // First ss if the input value contains data
  // TODO Make the max min values configurable from our configuration file.
  if (!validateLength(inputField, 1, 32))
    return false;

  // the first character of SIDD can not be #!; so we need to create a regular expression for that scenario
  return validateRegEx(/^[\w\-+]{1}[\w\-+!#;]{0,31}$/, inputField);
}


// This wraps the piWifi status method in a promise to allow it to be used with an async/await call
function getpiWifiStatus() {
  return new Promise( (resolve, reject) => {
      piWifi.status('wlan0', function (err, status) {
        if (err) {
          console.error(err.message);
          reject (err.message);
        } else {
          console.log('*** Scan Current WiFi network complete -> Status: ' + status.ssid);
          resolve (status);
        }
      });
  });
}

// This wraps the piWifi scan method in a promise to allow it to be used with an async/await call
function getpiNetworkSIDDs () {
  return new Promise((resolve, reject) => {
      piWifi.scan(function (err, networks) {
      const networkSidds = new Set();
      if (err) {
        console.error(err.message);
        reject(err.message);
      } else {
        console.log('*** Scan WiFi networks complete ***:');
        for (i = 0; i < networks.length; i++) {
          //console.log(networks[i].ssid);
          networkSidds.add(networks[i].ssid);
        }
        //console.log('*** Captured SIDDs networks:');
        //for (let item of networkSidds) console.log(item);
        resolve(networkSidds);
      }
    });
  });
}

// This wraps the piWifi ListNetworks method in a promise to allow it to be used with an async/await call
function getpiWPAconfEntries () {
  return new Promise(( resolve, reject) => {
      piWifi.listNetworks(function (err, networksArray) {
      if (err) {
        console.error(err.message);
        reject(err.message);
      } else {
        console.log('*** Scan WiFi config complete *** ');
        //console.log(networksArray);
        resolve(networksArray);
      }
    });
  });
}

// Temporary for testing
// TODO Remove this.
var networkDetails = {
  	
  ssid: 'srbackup',
  username: '',
  psk: 'Tr3x1949'
};


var networkDetails2 = {
  ssid: 'skynet',
  username: '',
  psk: 'samw3llb33d4y'
};



function connectToWiFiNetwork(password) {
  return new Promise((resolve, reject) => {


    piWifi.conectTo (networkDetails, function(err) {
      if(err) {
        console.error(err.message);
        reject(err.message);
      } else {
        console.error('Network created successfully!'); //Failed to connect
        resolve('success');
      }
    });
  });
}



function WiFiServiceDiscovery () {
  this.wifiSSID = config.get('defaultWiFi.activeSSID');
  this.ip = config.get('defaultWiFi.ip');
  this.mac = config.get('defaultWiFi.mac');
  this.securitCharacteristic = config.get('defaultWiFi.securityCharacteristic');
  this.status = 'inactive';
  this.networks = new Set();
  this.networksWPAconfig = [];
}

// The get status method is called to get current network state. This needs to be done before interrogating the object on instantiation.
WiFiServiceDiscovery.prototype.getStatus = async function() {
  let status = await getpiWifiStatus();
  this.networks = await getpiNetworkSIDDs();
  this.networksWPAconfig = await getpiWPAconfEntries();
  this.wifiSSID = status.ssid;
  this.securitCharacteristic = status.key_mgmt;
  this.ip = status.ip;
  this.mac = status.mac;
  this.status = 'active';
	return this.status;
}

WiFiServiceDiscovery.prototype.connect = async function(password) {
  let status = await connectToWiFiNetwork(password);
}

WiFiServiceDiscovery.prototype.setSSID = function(ssid) {
  if (validateSSID(ssid)){
    // TODO make this throw an error of invalid number if validation fails
    this.wifiSSID = ssid;
    console.log(' setSSID - SSID has been updaed to:' + this.wifiSSID);
    return true;
  } else {
    return false;
  }
};


WiFiServiceDiscovery.prototype.checkPassword = function(ssid) {
  return (validatePassword(ssid))
};


//wifiService.getStatus().then( (state) => {
//  console.log(' The object state is: ' + state);

//});


piWifi.check('skynet-guest', function(err, result) {
  if (err) {
    return console.error(err.message);
  }
  console.log(result);
});

//piWifi.connectTo (networkDetails, function(err) {
//  if(err) {
//    console.log('error');

//  } else {
//    console.log('success');
//  }
//});


piWifi.connect('srguest', 'St3g1950', function(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log('Successful connection!');
});


piWifi.check('skynet-guest', function(err, result) {
  if (err) {
    return console.error(err.message);
  }
  console.log(result);
});




//
// This will list the networks currently defined in the wpa config file.
// piWifi.listNetworks(function(err, networksArray) {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log('*** List networks:')
//   console.log(networksArray);
//});

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
    //console.log(networks);
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
//    ssid: 'Anot herNetwork' },
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
