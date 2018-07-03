# SamsungBluetoothWiFiManager
This is a node.js application that will allow WiFi configuration of a server. Designed to be used on Gateway devices or devices that need to be configured that may not have a UI to allow user configuration. Once the setup and installation is complete you will be able to take your device (mobile phone)and use it to control how your Raspberry Pi attaches to other WiFi networks without the use of a keyboard or mouse.

The application will use a Bluetooth Low Energy peripheral connection to expose an interface to setup your WiFi.

## Prerequisits
For this application we used the Raspberry Pi 3B and Raspberry Pi Zero W.

### Operating System
The version of Rasbian used was Rasbian Stretch 2018-06-27
It is recommended you update your system with: /> sudo apt update

### Node Version
The Raspberry Pi 0 comes with a very old version of node (4.8). To update to a more recent version we ran a bash script allowing you to easily upgarde. Instructions here:
https://github.com/audstanley/NodeJs-Raspberry-Pi

Once you have installed node you can check the version like this:
      pi@raspberrypi:~/samsung $ node -v
      v8.10.0
      
At the time of writing version 8.10 was used. Once node is on your system you need to allow the node binary access to LCAP on your system. To set the permissions on the Raspberry Pi do:

     /> sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)

### Required Software Components
The underlying system depends on prerequisits for the bleno library. But to minimise context switchin we have placed the commands below:

     /> sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev build-essential

You will also need the node software package management system called 'npm'. To install do:

     /> sudo apt-get install npm
   
## Installation Instructions
This has been tested on Rasbian Stretch 2018 Version. On a fresh Rasbian Stretch image do:

* /> mydir my-project                                     // Create your project directory
* /> git clone https://github.com/nherriot/SamsungBluetoothWiFiManager.git    // Clone this repo to your directory
* /> cd ~/my-project/SamsungBluetoothWiFiManager/bleno    // Move to the directory that contains the pacakges used for the system
* /> npm install                                          // Use Node's package management system to install all needed node pacakges.

Your system should now be up todate. If you want to install packages manually you will need the 'bleno' and 'pi-wifi' npm pacakges:

     /> npm install bleno 
     
     /> npm install pi-wifi

## Starting The Program
To start the bluetooth wifi manager go to the direcotry:

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
To easily control your bluetooth wifi manager you need to access the Bluetooth Progressive Web Application (PWA) built for the system.
TODO - Complete this section
