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

    const service = await server.getPrimaryService(WIFI_SETUP_SERVICE_UUID);

    console.log('service', service);

    const characteristic = await service.getCharacteristic(WIFI_SIDDS_LIST_UUID);

    console.log('characteristic', characteristic);

    const value = await characteristic.readValue();		

    console.log('Wifi SSIDs value...', value);

    const array = new Uint8Array(value);

    console.log('array ', array, array.length, array.byteLength);

    for (let i=0; i < array.byteLength; i++) {
        console.log(i + ' : ' + array[i]);
    }

    return array;

}