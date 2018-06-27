/**
 * See: https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
 */
export function arrayBufferToString(arrayBuffer) {
    const array = new Uint8Array(arrayBuffer);
    const string = String.fromCharCode(...array);

    console.log('string', string);

    return string;
}

/**
 * See: https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
 */
export function stringToArrayBuffer(string) {
    const stringLength = string.length;
    const arrayBuffer = new ArrayBuffer(stringLength * 2);
    const array = new Uint16Array(arrayBuffer);
    for (let i=0; i < stringLength; i++) {
        array[i] = string.charCodeAt(i);
        console.log({i}, array[i]);
    }
    return arrayBuffer;
}
