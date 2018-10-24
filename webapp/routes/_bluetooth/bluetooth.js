import {arrayBufferToString, stringToArrayBuffer} from './utils.js';

const WIFI_SETUP_SERVICE_UUID = '00010000-89bd-43c8-9231-40f6e305f96d',
      WIFI_SSID_UUID = '00010001-89bd-43c8-9231-40f6e305f96d', // Currently set SSID
      WIFI_PASSWORD_UUID = '00010002-89bd-43c8-9231-40f6e305f96d',
      //WIFI_SECURITY_UUID = '00010003-89bd-43c8-9231-40f6e305f96d',
      WIFI_NETWORK_STATE_UUID = '00010005-89bd-43c8-9231-40f6e305f96d',
      WIFI_SIDDS_LIST_UUID = '00010004-89bd-43c8-9231-40f6e305f96d',
      SUCCESSFUL = true,
      UNSUCCESSFUL = false;

let device,
    server;

export const NETWORK_STATUS = {
    COMPLETED: 'COMPLETED',
    DISCONNECTED: 'DISCONNECTED',
    SCANNING: 'SCANNING',
    ASSOCIATING: 'ASSOCIATING'
}

export function isSupported() {
    return !!navigator.bluetooth && !!navigator.bluetooth.requestDevice;
}

export async function getDevice() {

    device = await navigator.bluetooth.requestDevice({
        filters: [{
            name: ['IoT Gateway WiFi Setup']
        }],
        optionalServices: [WIFI_SETUP_SERVICE_UUID]
    });

    console.log('device', device);

    return device;

}

export async function connect() {
    
    if (!device) {
        console.log('Device not established yet');
        return null;
    }

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

    try {
        const value = await characteristic.readValue();		

        console.log('Wifi SSIDs value...', value);

        const string = arrayBufferToString(value.buffer);

        const ssids = string.split(',');
    
        console.log('ssids', ssids);
    
        return ssids;

    } catch (error) {
        console.error('Error getting SSIDs', error);
        return null;
    }

}

/**
 * Returns a boolean for whether the write succeeded
 */
export async function setWifiSSID(ssid) {

    console.log('setWifiSSID', `"${ssid}"`);

    if (!server) {
        console.log('Server not established. Try to (re-)connect first.');
        return UNSUCCESSFUL;
    }

    const service = await server.getPrimaryService(WIFI_SETUP_SERVICE_UUID);

    console.log('service', service);

    const characteristic = await service.getCharacteristic(WIFI_SSID_UUID);

    console.log('characteristic', characteristic);

    /*
    const value = await characteristic.readValue();		

    console.log('BEFORE ssid value:', arrayBufferToString(value));
    */

    const arrayBuffer = stringToArrayBuffer(ssid);

    console.log('Write buffer', arrayBuffer);

    try {
        const response = await characteristic.writeValue(arrayBuffer);
        console.log({response});
        return SUCCESSFUL;
    } catch (error) {
        console.error('Error setting wifi ssid', ssid, error);
    }
    
    return UNSUCCESSFUL;
}

/**
 * Returns a boolean for whether the write succeeded
 */
export async function setWifiPassword(password) {

    console.log('setWifiPassword', password);

    if (!server) {
        console.log('Server not established. Try to (re-)connect first.');
        return null;
    }

    const service = await server.getPrimaryService(WIFI_SETUP_SERVICE_UUID);

    console.log('service', service);

    const characteristic = await service.getCharacteristic(WIFI_PASSWORD_UUID);

    console.log('characteristic', characteristic);

    const arrayBuffer = stringToArrayBuffer(password);

    console.log('Write buffer', arrayBuffer);

    try {
        const response = await characteristic.writeValue(arrayBuffer);
        console.log({response});
        return SUCCESSFUL;
    } catch (error) {
        console.error('Error setting wifi password', password, error);
    }
    
    return UNSUCCESSFUL;

}

/**
 * Bluetooth response should be a comma-separated string: Status, IP address.
 * This function returns the values as an object:
 *   {
 *     status: [string],
 *     ipAddress: [string]
 *   }
 */
export async function getNetworkState() {

    console.log('getNetworkState');

    if (!server) {
        console.log('Server not established. Try to (re-)connect first.');
        return null;
    }

    const service = await server.getPrimaryService(WIFI_SETUP_SERVICE_UUID);

    console.log('service', service);

    const characteristic = await service.getCharacteristic(WIFI_NETWORK_STATE_UUID);

    console.log('characteristic', characteristic);

    try {
        const value = await characteristic.readValue();

        console.log('Network status value...', value);

        const string = arrayBufferToString(value.buffer);

        console.log('Network status string', string);
    
        const stateValues = string.split(',');
    
        if (stateValues.length < 2) {
            console.error('Invalid network status', string, stateValues);
            return null;
        }
    
        return {
            status: stateValues[0],
            ipAddress: stateValues[1]
        };

    } catch (error) {
        console.error('Error getting network state', error);
        return null;
    }

}

