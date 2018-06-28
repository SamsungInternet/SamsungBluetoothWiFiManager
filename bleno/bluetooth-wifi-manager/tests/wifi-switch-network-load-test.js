/**
 * Created by nherriot on 12/06/18.
 */

var piWifi = require('pi-wifi');

var networkDetails = {
  ssid: 'srbackup',
  password: 'Tr3x1949',
  key_mgmt: 'WPA-PSK',
};

var networkDetails2 = {
  ssid: 'srguest',
  password: 'St3g1950',
  key_mgmt: 'WPA-PSK',

};

var networkDetails3 = {
  ssid: 'nicks-nexus',
  password: 'gr00vtech0423',
  key_mgmt: 'WPA-PSK',
};


/**
 * A simple test case that can be used to test changing connections
 * multiple times. It uses 3 networks defined in networkDetails,
 * networkDetails2 and networkDetails3.
 * 
 * @run	/> nodejs wifi-switch-network1.js
 * 
 * 
 */ 


function asynConnect(networkDetails) {
	return new Promise((resolve, reject)=> {
		 
		piWifi.connectTo (networkDetails, function(err) {
		  if(err) {
			console.error('Connection error: ' + err.message);
			reject(err.message);

		  } else {
			console.log('success');
			resolve('success');
		  }
		});
	});
}

let iterations=3;

testNetworks = async function(net1, net2, net3, iterations) {
	for (x=0; x<iterations; x++){
		console.log('\n\n*** Iteration *** ' + x);
		let result = await asynConnect(net1);
		console.log('Connecting to: ' + net1.ssid + " was: " + result);
		let result2 = await asynConnect(net2);
		console.log('Connecting to: ' + net2.ssid + " was: " + result2);
		let result3 = await asynConnect(net3);
		console.log('Connecting to: ' + net3.ssid + " was: " + result3);
	}
	return 'Done';
};


console.log('Running tests: ' + iterations + ' times.');
testNetworks(networkDetails, networkDetails2, networkDetails3, iterations).then( (state) => {
	console.log('WiFi Changed 3 times -> stateChange:');
	console.log(state);
});

