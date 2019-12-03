# Raspberry PI C4
A C4 that runs on a Raspberry Pi (for playing airsoft)

Stuff...

# BOOT folder
The boot folder has a file called startup.sh which is supposed to be run with crontab

If crontab is not setup do: 
 `
 crontab -e
 `
 add the following and save (assuming you cloned the repo), where [GithubLocation] is the path for the cloned repo
 `
 @reboot [GithubLocation]/rpic4/BOOT/startup.sh
 `
 What I use, for example:
 `
 @reboot home/pi/github/rpic4/BOOT/startup.sh
 `
 
