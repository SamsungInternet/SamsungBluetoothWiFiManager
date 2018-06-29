/**
 * Created by nherriot on 06/06/18.
 */

const bleno = require("bleno");                                       // The bluetooth low energy library used
const constants = require('./config/constants');                      // Constants used for the system.
const config = require('config');									  // Configuration parameters
const wifi = require('./wifi-controller');                            // The wifi controller manager to manage an interface to the WiFi logic

var BlenoPrimaryService = bleno.PrimaryService;

var WifiSSIDCharacteristic = require('./wifi-ssid-characteristic');
var WiFiPasswordCharacteristic = require('./wifi-password-characteristic');
var WiFiSecurityCharacteristic = require('./wifi-security-characteristic');
var WiFiNetworkStateCharacteristic = require('./wifi-network-state-characteristic');
var NetworCharacteristic = require('./wifi-networks-characteristic');

console.log('bleno - Bluetooth WiFi Manager');

const iShouldExit = true;			                                        // Used to set the manager to handle closing down. if true the manager will stop
                                                                      // wpa_supplicant when the ctrl-d key stroke is intercepted.


/**
 * A small helper function that will force the WiFi manager to close down when ctrl-d is hit. This tries to stop the wpa_supplicant process
 * closing in an unknown state.
 *
 *
 */
process.on('SIGINT', function() {

    if (iShouldExit)
		console.log("\n\n\n***** BlueTooth Manager Closing down. Please wait... *****");
		wifi.wifiService.stopWPAsupplicant();			// try and cleanly stop wpa_supplicant
        process.exit();
});


/**
 * Our main loop. Before we start listening to bluetooth we need to scan and get the status of our WiFi networks. Hence wo make a synchronous
 * call to getStatus and continue when we not that is complete.
 * We then listen on bluetooth events for 'poweredOn' and 'advertisingStart'. Once this has happened we can start listening to our Bluetooth GATT
 * characteristics.
 *
 */
wifi.wifiService.getStatus().then( (state) => {
  console.log(`WiFi -> stateChange: ${state}`);

  bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
        bleno.startAdvertising(constants.BLUETOOTH_SERVICE_NAME, [constants.WIFI_SETUP_SERVICE_UUID] );
      } else {
        bleno.stopAdvertising();
      }
    });

  // Only listen on 'advertisingStart' after the WiFi Manager has scanned networks
  bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

    if (!error) {
      bleno.setServices([
        new BlenoPrimaryService({
          uuid: constants.WIFI_SETUP_SERVICE_UUID,
          characteristics: [
            new WifiSSIDCharacteristic(),
            new WiFiPasswordCharacteristic(),
            new WiFiSecurityCharacteristic(),
            new WiFiNetworkStateCharacteristic(),
            new NetworCharacteristic()
          ]
        })
      ]);
    }
  });
});


/**
 * A small interval function which will refresh our WiFi object with any changes to state. This is done to periodically check. We
 * do this every time we receive a Bluetooth request for WiFi data - but that would delay the Bluetooth interaction.
 * Currently the belief is that WiFi networks will not change much for a static gateway - so only do the check for the specified
 * in our default.json file. A configuration option. (60 sec at the time of writing)
 *
 */
function intervalFunc() {
  console.log('\n** Interval function called **');
  wifi.wifiService.getStatus().then( (state) => {
    console.log(`WiFi -> stateChange: ${state}`);
  });  
};

setInterval(intervalFunc, config.get('intervalWiFiCheck')*1000);


