# SamsungBluetoothWiFiManager
![Main App Screenshot](docs/main-heading-design1.png)
This is a node.js application that will allow WiFi configuration of a server. Designed to be used on Gateway devices or devices that need to be configured that may not have a UI to allow user configuration. Once the setup and installation is complete you will be able to take your device (mobile phone)and use it to control how your Raspberry Pi attaches to other WiFi networks without the use of a keyboard or mouse.

The application will use a Bluetooth Low Energy peripheral connection to expose an interface to setup your WiFi.


## Prerequisits
For this application we used the Raspberry Pi 3B and Raspberry Pi Zero W.

### Operating System
The version of Rasbian used was Rasbian Stretch 2018-06-27
It is recommended you update your system with: /> sudo apt update

### Node Version and Node Package Manager
The Raspberry Pi 0 comes with a very old version of node (4.8) and Node Package Manager (NPM). To update to a more recent version we ran a bash script written by audstanley.com ( Thank you Mr Audstanley! :-) ) allowing you to easily upgarde. Instructions here:
https://github.com/audstanley/NodeJs-Raspberry-Pi

After the shell script is run you will have the latest version of node running on your system. To change to a specific version you can run:

     /> sudo node-install -v 8.10
     
Then select the specific version you require.

Once you have installed node you can check the version like this:
     
     />pi@raspberrypi:~/samsung $ node -v
     v8.10.0
      
At the time of writing version 8.10 was used. Once node is on your system you need to allow the node binary access to LCAP on your system. To set the permissions on the Raspberry Pi do:

     /> sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)

Finally, the NPM system has to upgraded to a newer release. To do this use the command:

     /> npm install -g npm
     
You need to do it in this order, since npm uses node. To check your version of NPM do:

     /> npm -v
     5.6.0
     
      ╭─────────────────────────────────────╮
      │                                     │
      │   Update available 5.6.0 → 6.1.0    │
      │     Run npm i -g npm to update      │
      │                                     │
      ╰─────────────────────────────────────╯


### Required Software Components
The underlying system depends on prerequisits for the bleno library. But to minimise context switching we have placed the commands below:

     /> sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev build-essential

You will also need the node software package management system called 'npm'. To install do:

     /> sudo apt-get install npm

   
## Installation Instructions
This has been tested on Rasbian Stretch 2018 Version. The process involves the setup of the embedded bluetooth low energy application (BLE) and the setup of a
progressive web application (PWA) which is used to control the embedded device.

### Setup Of Embedded BLE Application
On a fresh Rasbian Stretch image do:

     /> mkdir samsung                                        // Create your project directory
     /> git clone https://github.com/nherriot/SamsungBluetoothWiFiManager.git    // Clone this repo to your directory
     /> cd ~/my-project/SamsungBluetoothWiFiManager/bleno    // Move to the directory that contains the pacakges used for the system
     /> npm install                                          // Use Node's package management system to install all needed node pacakges.

Your system should now be up to date. If you want to install packages manually you will need the 'bleno' and 'pi-wifi' npm packages:

     /> npm install bleno 
     
     /> npm install pi-wifi

### Starting The Program From Command Line
To start the bluetooth wifi manager go to the directory:

    /> cd /home/pi/my-project/SamsungBluetoothWiFiManager/bleno/bluetooth-wifi-manager
  
    /> node bluetooth-wifi-manager.js
    *** Scan WiFi networks complete ***:
    *** Scan WiFi networks complete ***:
    *** Scan WiFi config complete *** 
    WiFi -> stateChange: inactive
    *** Scan WiFi config complete *** 
    The object state is: inactive
    on -> stateChange: poweredOn
    on -> advertisingStart: success
    Encryption is :  ["NONE","WEP 128b ASCii","WEP 128b Pasephrase","LEAP","WEP","WPA2 Personal","WPA2 Enterprise"]
    wifi networks characteristics network array is: 
    *** Scan WiFi networks complete ***:
    The network sidds are: 
    Set { 'xxxxxxxx' }


## Setup Bluetooth Progressive Web Application
To easily control your bluetooth wifi manager you need to access the Bluetooth Progressive Web Application (PWA) built for the system. You can access the PWA
app by navigating to the secure URL https://things.samsunginter.net - however to deploy the application directly and setup on your own static or dynamic web
server [navigate here](https://github.com/nherriot/SamsungBluetoothWiFiManager/tree/master/webapp)


## Testing And Logging
To verify that the application is working properly on your system we recommend using the [Light Blue Android application](https://play.google.com/store/apps/details?id=com.punchthrough.lightblueexplorer)
1) Download this to your Android mobile and pair with the bluetooth name 'IoT Gateway WiFi Setup'. From the main menu scroll down and select the BLE GATT 
characteristic you wish to view.
e.g. 'The current WiFi SSID name'

2) Check the log output from your terminal window if you have not started using the bluetooth-wifi-manager.service e.g.


     ```/> node bluetooth-wifi-manager.js 
        bleno - Bluetooth WiFi Manager
        *** Scan Current WiFi network complete -> Status: srbackup
        { bssid: '*****************',
          frequency: 2462,
          mode: 'station',
          key_mgmt: 'wpa2-psk',
          ssid: '********',
          pairwise_cipher: 'CCMP',
          group_cipher: 'CCMP',
          p2p_device_address: '*****************',
          wpa_state: 'COMPLETED',
          ip: '192.168.***.***',
          mac: '*****************',
          uuid: 'd088177e-5fbf-5e36-8cea-9bb90ad648f9',
          id: 25 }
        *** Scan WiFi networks complete ***:
        *** Scan WiFi config complete *** 
        WiFi -> stateChange: COMPLETED
        on -> stateChange: poweredOn
        on -> advertisingStart: success```
	
3) From the Light Blue	Android application view the current WiFi SSID. i.e. 'READ' the GATT characteristic. You should see the log output from your terminal
window look something like this:


	```/> Active SSID Characteristic - onReadRequest: value = s******p ```
	
Congratulations the embedded application is running and working. To interact with the application using the PWA	app by going to the 
secure URL https://things.samsunginter.net

