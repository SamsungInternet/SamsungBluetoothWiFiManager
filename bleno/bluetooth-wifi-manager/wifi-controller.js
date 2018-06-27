/**
 * Created by nherriot on 12/06/18.
 */

var piWifi = require('pi-wifi');
const config = require('config');

const wifiService = new WiFiServiceDiscovery();


// Temporary for testing
// TODO Remove this.
var networkDetails = {
  ssid: 'srbackup',
  password: 'xxxxxxxx',
  key_mgmt: 'WPA-PSK',

};


var networkDetails2 = {
  ssid: 'srguest',
  password: 'xxxxxxxx',
  key_mgmt: 'WPA-PSK',
};


var networkDetails3 = {
  ssid: 'skynet',
  password: 'xxxxxxxx',

};




// First create a promise which will wait some time before returning.
// Here we add a delay by using the setTimeout function. Our Promise gets
// resolved after 2 seconds and is loged out to the screen at line 41.
// But what happens if we want to have one thing depend on the other ?
function doubleAfter2Seconds(x) {
  return new Promise(resolve => {
    setTimeout(() => {resolve("complete");}, x*1000);
  });
}

/**
 * A small helper function to Validate non empty fields.
 *
 * @return: {boolean} 'True' if input field is not empty.
 * 'False' if input field is empty.
 *
 * This function searches /config or db.sqlite3 DB
 *
 * @param {}
 */
function validateNonEmpty(inputField) {
  // See if the input value contains any text
  if (inputField.value.length == 0) {
    return false;
    } else {
  // The data is present, but may not be correct!
    return true;
  }
}


/**
 * A small helper function validate the length of a field.
 *
 * @return: {boolean} 'True' if the input field is withing minimum and maximum length
 * 'False' if input field is outside the minimum and maximum length
 *
 * This function searches /config or db.sqlite3 DB
 *
 * @param {string, integer (minimum length), integer (maximum length}
 */
function validateLength(inputField, minLength, maxLength) {
  // Make sure the input value contains at least the maxiumum or minimum number of characters
  // TODO Ensure we protect against bad max min values e.g. negative numbers.
  if (inputField.length < minLength || inputField.length > maxLength) {
    return false;
  } else {
    // The data is OK, so clear the help message
    return true;
  }
}


/**
 * A small helper function to validate password.
 *
 * @return: {boolean} 'True' if password is within 8 and 32 characters in length.
 * 'False' if the password is outside 8 and 32 parameters in length.
 *
 * @param {string (password field)}
 */
function validatePassword(inputField) {
  // Make sure the password is within certain boundaries
  // TODO Add a good password validation library here. For now make sure it is at least 8 chars and less than 32
  return validateLength(inputField, 8, 32);
}


/**
 * A small helper function to validate a string against a regular expression.
 *
 * @return: {boolean} 'True' if the input string matches the regular expression.
 * 'False' if the input string does not match the regular expression.
 *
 *
 * @param {regex, string}
 * e.g ' = {validateRegEx(/^\d{2}\/\d{2}\/\d{4}$/, '02/06/2018')}
 *
 *      This validates the string is of the form 2 digits, backslash, 2 digits, backslash and 4 digits.
 *      So a date range.
 */
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


/**
 * A small helper function to validate the SSID value is within a certain MAX/MIN range and then has the pattern
 * of any digit, character, + and _ for the first char, then any digit, character, +, -, !, #, ; for the rest.
 *
 * @return: {boolean} 'True' if the input string matches the regular expression.
 * 'False' if the input string does not match the regular expression.
 *
 * @param {string}
 *
 */
function validateSSID(inputField) {
  // First ss if the input value contains data
  // TODO Make the max min values configurable from our configuration file.
  // TODO Maybe look at scanning wifi networks and verify it is a valid SSID
  if (!validateLength(inputField, 1, 32))
    return false;

  // the first character of SSID can not be #!; so we need to create a regular expression for that scenario
  return validateRegEx(/^[\w\-+]{1}[\w\-+!#;]{0,31}$/, inputField);
}


/**
 * A wrapper function which wraps the piWifi.status method in a promise so that it can be used in an async call in a linear way
 * and to allow the library to plugin other WiFi control libraries without changing the interface.
 *
 * @returns {Promise} 'Reject' if the subsystem can't get status of the WiFi networks.
 * Or 'Resolve' with a status JSON Object containing the result of the WiFi status
 *
 * e.g.
 * {
 *  bssid: '2c:f5:d3:02:ea:d9',
 *  frequency: 2412,
 *  mode: 'station',
 *  key_mgmt: 'wpa2-psk',
 *  ssid: 'MyNetwork',
 *  pairwise_cipher: 'CCMP',
 *  group_cipher: 'CCMP',
 *  p2p_device_address: 'aa:bb:cc:dd:ee:ff',
 *  wpa_state: 'COMPLETED',
 *  ip: '10.20.30.40',
 *  mac: 'a1:b2:c3:d4:e5:f6',
 *  uuid: 'e1cda789-8c88-53e8-ffff-31c304580c22',
 *  id: 0
 *  }
 */
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


/**
 * A wrapper function which wraps the piWifi.scan method in a promise so that it can be used in an async call in a linear way
 * and to allow the library to plugin other WiFi control libraries without changing the interface.
 * This method will also use a javascript SET to ensure no duplicate SSID's are stored.
 *
 * @returns {Promise} 'Reject' if the subsystem can't scan WiFi networks.
 * Or 'Resolve' with a networkSidds JSON Object containing the result of the WiFi scan
 *
 * e.g.
 * {
 * { bssid: 'aa:bb:cc:dd:ee:ff',
 * frequency: 2462,
 * signalLevel: -40,
 * flags: '[WPA2-PSK-CCMP][WPS][ESS]',
 * ssid: 'MyNetwork' },
 * { bssid: '11:22:33:44:55:66',
 * frequency: 2462,
 * signalLevel: -28,
 * flags: '[WPA2-PSK-CCMP][ESS]',
 * ssid: 'AnotherNetwork' },
 *
 */
function getpiNetworkSSIDs () {
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
        //console.log('*** Captured SSIDs networks:');
        //for (let item of networkSidds) console.log(item);
        resolve(networkSidds);
      }
    });
  });
}


/**
 * A wrapper function which wraps the piWifi.listNetworks method in a promise so that it can be used in an async call in a linear way
 * and to allow the library to plugin other WiFi control libraries without changing the interface.
 *
 * @returns {Promise} 'Reject' if the subsystem can't get wpa_suplicant WiFi networks (taken from /etc/wpa_suplicant/wpa_suplicant.conf).
 * Or 'Resolve' with a networkArray JSON Object containing the result of the wpa_supplicant file. Each network contains a SSID, BSSID and flags.
 *
 * e.g.
 *  [{ network_id: 0, ssid: 'MyNetwork', bssid: 'any', flags: '[DISABLED]' },
 *  { network_id: 1, ssid: 'Skynet', bssid: 'any', flags: '[CURRENT]' }]
 *
 */
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


/**
 * The WiFiServiceDiscovery object definition. This contains the data members of the WiFiServiceDiscovery class.
 * Upon creation of an object of this class i will pull default values from configuration file default.json
 *
 * @returns {object} A WiFiServieDiscovery object
 *
 * @param {wifiSSID: The current SSID of the WiFi network,
 *          ip: The IP of the WiFi wlan0 interface,
 *          mac: The MAC address of the WiFi network interface card,
 *          securityCharacteristics: A list of supported security characteristics,
 *          status: Status of the WiFi netork i.e. connected or not,
 *          networks: An array of known WiFi networks,
 *          networksWPAconfig: Current security network characeristic}
 *
 */
function WiFiServiceDiscovery () {
  this.wifiSSID = config.get('defaultWiFi.activeSSID');
  this.ip = config.get('defaultWiFi.ip');
  this.mac = config.get('defaultWiFi.mac');
  this.securitCharacteristic = config.get('defaultWiFi.securityCharacteristic');
  this.status = 'inactive';
  this.networks = new Set();
  this.networksWPAconfig = [];
}


/**
 * An async function that returns when the WiFiServiceDiscovery object is populated with current state of the network.
 * This method fires off WiFi lib calls to get the Networks SSIDs Array, the current status (connected or not) and
 *
 * @returns {string} The string representing the current state.
 *
 */
WiFiServiceDiscovery.prototype.getStatus = async function() {
  let status = await getpiWifiStatus();
  this.networks = await getpiNetworkSSIDs();
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


/**
 * A simple method of the WiFiServiceDiscovery class to validate a SSID and update the member variable of the
 * WiFiServiceDiscovery object.
 *
 * @returns {string} The string representing the current state.
 *
 * @param {string} The SSID value being updated. e.g. 'my-wifi-network'
 */
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

/**
 * A simple method of the WiFiServiceDiscovery class to validate a password and update the member variable of the
 * WiFiServiceDiscovery object.
 *
 * @returns {string} The string representing the current state.
 *
 * @param {string} The SSID value being updated. e.g. 'my-wifi-network'
 */
WiFiServiceDiscovery.prototype.checkPassword = function(ssid) {
  return (validatePassword(ssid))
};


//wifiService.getStatus().then( (state) => {
//  console.log(' The object state is: ' + state);

//});

//wifiService.getNetworkSSIDs().then( (networks) => {
  //console.log(' The network sidds are: ' + networks);
//});

//piWifi.check('srbackup', function(err, result) {
  //if (err) {
    //return console.error(err.message);
  //}
  //console.log(result);
//});

//piWifi.connectTo (networkDetails2, function(err) {
  //if(err) {
    //console.log('Connection error: ' + err.message);

  //} else {
    //console.log('success');
  //}
//});


//piWifi.connect('nicks-nexus', 'xxxxxxxx', function(err) {
  //if (err) {
    //return console.error(err);
  //}
  //console.log('Successful connection!');
//});


//piWifi.disconnect(function(err) {
  //if (err) {
    //return console.error(err.message);
  //}
  //console.log('Disconnected from network!');
  

//});


debugger;
  piWifi.connect('srguest', 'xxxxxxxx', function(err) {
	if (err) {
		return console.error(err);
	}
	console.log('Successful connection!');
  });



//piWifi.connect('srbackup', 'xxxxxxxx', function(err) {
  //if (err) {
    //return console.error(err);
  //}
  //console.log('Successful connection!');
//});



//piWifi.check('srbackup', function(err, result) {
  //if (err) {
    //return console.error(err);
  //}
  //console.log(result);
//});




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
//piWifi.scan(function(err, networks) {
  //if (err) {
    //return console.error(err.message);
  //}
  //console.log('*** Scan WiFi networks:');
  //for (i=0; i< networks.length; i++) {
    //console.log(networks[i].ssid);
    ////console.log(networks);
  //}
//});

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
