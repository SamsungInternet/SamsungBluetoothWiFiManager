const bleno = require("bleno");
const UUID = "69d9fdd724fa4987aa3f43b5f4cabcbf"; // set your own value
const MINOR = 2; // set your own value
const MAJOR = 1; // set your own value
const TX_POWER = -60; // just declare transmit power in dBm

console.log("Starting bleno...");

bleno.on("stateChange", state => {
    if (state === 'poweredOn') {
        console.log("Starting broadcast...");
        bleno.startAdvertisingIBeacon(UUID, MAJOR, MINOR, TX_POWER, err => {
            if(err) {
                console.error(err);
            } else {
                console.log(`Broadcasting as iBeacon uuid:${UUID}, major: ${MAJOR}, minor: ${MINOR}`);
            }
        });
    } else {
        console.log("Stopping broadcast...");
        bleno.stopAdvertising();
    }        
});

