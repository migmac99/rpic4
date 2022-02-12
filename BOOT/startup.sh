#! /bin/sh

#DONT DELETE THIS SCRIPT
#THIS IS THE BOOT STARTUP SCRIPT
#Everything inside will run on boot

# For scheduled tasks after boot use --> crontab -e


# Prints the IP Address
_IP=$(hostname -I) || true
if [ "$_IP" ]; then
	printf "My IP is %s \n" "$_IP"
fi

# Start ssh server
sudo systemctl enable ssh
sudo systemctl start ssh

# Start Glances 
sudo systemctl enable glances.service
sudo systemctl start glances.service

#sudo systemctl enable connection.service
#sudo systemctl start connection.service
#sudo systemctl staatus connection.service
