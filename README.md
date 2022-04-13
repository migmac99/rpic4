1

# Raspberry PI C4
A C4 that runs on a Raspberry Pi (for playing airsoft)

This creates a node.js server

# Dependencies
- NPM ```sudo apt-get install npm```
- Install ```npm install```


# Install this
- ```sudo apt-get install -y python-smbus```
- ```sudo apt-get install -y i2c-tools```
- Enable I2C through ```sudo raspi-config``` > ```Advanced Options``` > ```I2C```
- Test I2C by doing ```sudo i2cdetect -y 1```

# DEV Auto Restart on Pull
- Install nodemon ```npm install nodemon --global```
- Then start server with ```nodemon index.js```

# Auto Restart
 ```sudo nano /etc/systemd/system/startscript.service```

- Paste the following
    ```
    #!/bin/sh

    cd home/pi/rpic4
    nodemon index.js
    ```
```sudo chmod +x /home/pi/StartupScript.sh```

```sudo nano /etc/systemd/system/startscript.service```
- Paste the following
    ```
    [Unit]
    Description=Script that runs on start

    [Service]
    ExecStart=/home/pi/StartupScript.sh

    [Install]
    WantedBy=multi-user.target
    ```

```sudo systemctl enable startscript.service```

```sudo systemctl start startscript.service```

```sudo systemctl status startscript.service```


# Auto Update

```sudo sh automate.sh```
```sudo chmod u+x *.sh```

To Open crontab do: ```crontab -e```

Then Paste this line:
```* * * * * /rpic4/automation/automate.sh >/dev/null 2>&1```

To restart crontab and apply changes do:
```sudo service crond restart```

To view if crontab is functionaling properly do: ```clear && grep CRON /var/log/syslog```

# Read more about the dependencies used here
https://www.npmjs.com/package/raspberrypi-liquid-crystal

https://www.youtube.com/watch?v=WHQOA0hEdoQ