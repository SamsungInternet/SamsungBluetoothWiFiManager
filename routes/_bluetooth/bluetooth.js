import {arrayBufferToString, stringToArrayBuffer} from './utils.js';

const WIFI_SETUP_SERVICE_UUID = '00010000-89bd-43c8-9231-40f6e305f96d';
const WIFI_SSID_UUID = '00010001-89bd-43c8-9231-40f6e305f96d'; // Currently set SSID
const WIFI_PASSWORD_UUID = '00010002-89bd-43c8-9231-40f6e305f96d';
const WIFI_SECURITY_UUID = '00010003-89bd-43c8-9231-40f6e305f96d';
const WIFI_SIDDS_LIST_UUID = '00010004-89bd-43c8-9231-40f6e305f96d';

let device,
    server;

export function isSupported() {
    return !!navigator.bluetooth && !!navigator.bluetooth.requestDevice;
}

export async function connect() {
    
    device = await navigator.bluetooth.requestDevice({
        filters: [{
            name: ['IoT Gateway WiFi Setup']
        }],
        optionalServices: [WIFI_SETUP_SERVICE_UUID]
    });

    console.log('device', device);

    server = await device.gatt.connect();

    console.log('server', server);

    return true;

}

export async function getWifiSSIDs() {

    if (!server) {
        console.log('Server not established. Try to (re-)connect first.');
        return null;
    }

    const service = await server.getPrimaryService(WIFI_SETUP_SERVICE_UUID);

    console.log('service', service);

    const characteristic = await service.getCharacteristic(WIFI_SIDDS_LIST_UUID);

    console.log('characteristic', characteristic);

    const value = await characteristic.readValue();		

    console.log('Wifi SSIDs value...', value);

    const string = arrayBufferToString(value.buffer);

    const ssids = string.split(' ');

    console.log('ssids', ssids);

    return ssids;

}

export async function settWifiSSID(ssid) {

    console.log('setWifiSSID');

    if (!server) {
        console.log('Server not established. Try to (re-)connect first.');
        return null;
    }

    const service = await server.getPrimaryService(WIFI_SETUP_SERVICE_UUID);

    console.log('service', service);

    const characteristic = await service.getCharacteristic(WIFI_SSID_UUID);

    console.log('characteristic', characteristic);

    const value = await characteristic.readValue();		

    console.log('BEFORE ssid value:', value);

    const arrayBuffer = stringToArrayBuffer(ssid);

    const response = await characteristic.writeValue(arrayBuffer);

    console.log({response});

    return response;
}

export async function settWifiPassword(password) {

    console.log('setWifiPassword');

    if (!server) {
        console.log('Server not established. Try to (re-)connect first.');
        return null;
    }

    const service = await server.getPrimaryService(WIFI_SETUP_SERVICE_UUID);

    console.log('service', service);

    const characteristic = await service.getCharacteristic(WIFI_PASSWORD_UUID);

    console.log('characteristic', characteristic);

    const arrayBuffer = stringToArrayBuffer(password);

    const response = await characteristic.writeValue(arrayBuffer);

    console.log({response});

    return response;

}