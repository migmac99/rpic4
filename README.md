# Raspberry PI C4
A C4 that runs on a Raspberry Pi (for playing airsoft)

This creates a node.js server


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
