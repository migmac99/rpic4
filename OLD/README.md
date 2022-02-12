# Raspberry PI C4
A C4 that runs on a Raspberry Pi (for playing airsoft)

This creates a node.js server

# Dependencies
- Node.js
- Express (html handling and such) ```npm install express --save```
- Express-Favicon (for favicon in website) ```npm install express-favicon --save```

# Installed on RPI (for complete headless build)
- Used this as a guide https://www.youtube.com/watch?v=5BkfztZ0pOE
  - ```sudo apt-get install isc-dhcp-server```
- hostapd & dnsmasq ```sudo apt install dnsmasq hostapd```
- PM2
- https://imti.co/iot-wifi/


# BOOT folder
The boot folder has a file called startup.sh which is supposed to be run with crontab.

For crontab config do: 
 ```
 crontab -e
 ```
 ---
 Add the following and save (assuming you cloned the repo), where **[GithubLocation]** is the path for the cloned repo
 ```
 @reboot [GithubLocation]/rpic4/BOOT/startup.sh
 ```
 What I use, for example:
 ```
 @reboot home/pi/github/rpic4/BOOT/startup.sh
 ```
 




# Ignore this (Dev related stuff)
Logging colors here --> https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
