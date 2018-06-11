const bleno = require("bleno");

const WIFI_SETUP_SERVICE_UUID = "00010000-89BD-43C8-9231-40F6E305F96D";
const WIFI_SSID_UUID = "00010001-89BD-43C8-9231-40F6E305F96D";
const WIFI_PASSWORD_UUID = "00010002-89BD-43C8-9231-40F6E305F96D";
const WIFI_SECURITY_UUID = "00010002-89BD-43C8-9231-40F6E305F96D"
const RESULT_UUID = "00010010-89BD-43C8-9231-40F6E305F96D";

class ArgumentCharacteristic extends bleno.Characteristic {
    constructor(uuid, name) {
        super({
            uuid: uuid,
            properties: ["write"],
            value: null,
            descriptors: [
                new bleno.Descriptor({
                    uuid: "2901",
                    value: name
                  })
            ]
        });

        this.argument = 0;
        this.value = "none";
        this.name = name;
    }

    onWriteRequest(data, offset, withoutResponse, callback) {
        try {
            if(data.length != 1) {
                callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
                return;
            }

            this.argument = data.readUInt8();
            this.value = data;
            console.log(`Argument ${this.name} is now ${this.argument}`);
            console.log(`Write request: value of ${this.name} is now ${this.value.toString("utf-8")}`);
            callback(this.RESULT_SUCCESS);

        } catch (err) {
            console.error(err);
            callback(this.RESULT_UNLIKELY_ERROR);
        }
    }
}

class ResultCharacteristic extends bleno.Characteristic {
    constructor(calcResultFunc) {
        super({
            uuid: RESULT_UUID,
            properties: ["read"],
            value: null,
            descriptors: [
                new bleno.Descriptor({
                    uuid: "2901",
                    value: "Calculation result"
                  })
            ]
        });

        this.calcResultFunc = calcResultFunc;
    }

    onReadRequest(offset, callback) {
        try {
            const result = this.calcResultFunc();
            console.log(`Returning result: ${result}`);

            let data = new Buffer(50);
            data.writeUInt8(result, 0);
            callback(this.RESULT_SUCCESS, data);
        } catch (err) {
            console.error(err);
            callback(this.RESULT_UNLIKELY_ERROR);
        }
    }
}

console.log("Starting bleno...");

bleno.on("stateChange", state => {

    if (state === "poweredOn") {
        
        bleno.startAdvertising("IoT Gateway Wifi Setup", [WIFI_SETUP_SERVICE_UUID], err => {
            if (err) console.log(err);
        });

    } else {
        console.log("Stopping...");
        bleno.stopAdvertising();
    }        
});

bleno.on("advertisingStart", err => {

    console.log("Configuring services...");
    
    if(err) {
        console.error(err);
        return;
    }

    let argument1 = new ArgumentCharacteristic(WIFI_SSID_UUID, "WIFI SSID");
    let argument2 = new ArgumentCharacteristic(WIFI_PASSWORD_UUID, "WIFI PASSWORD ");
    let result = new ResultCharacteristic(() => argument1.argument + argument2.argument);

    let calculator = new bleno.PrimaryService({
        uuid: WIFI_SETUP_SERVICE_UUID,
        characteristics: [
            argument1,
            argument2,
            result
        ]
    });

    bleno.setServices([calculator], err => {
        if(err)
            console.log(err);
        else
            console.log("Services configured");
    });
});


// some diagnostics 
bleno.on("stateChange", state => console.log(`Bleno: Adapter changed state to ${state}`));

bleno.on("advertisingStart", err => console.log("Bleno: advertisingStart"));
bleno.on("advertisingStartError", err => console.log("Bleno: advertisingStartError"));
bleno.on("advertisingStop", err => console.log("Bleno: advertisingStop"));

bleno.on("servicesSet", err => console.log("Bleno: servicesSet"));
bleno.on("servicesSetError", err => console.log("Bleno: servicesSetError"));

bleno.on("accept", clientAddress => console.log(`Bleno: accept ${clientAddress}`));
bleno.on("disconnect", clientAddress => console.log(`Bleno: disconnect ${clientAddress}`));

