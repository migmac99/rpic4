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


# Read more about the dependencies used here
https://www.npmjs.com/package/raspberrypi-liquid-crystal

https://www.youtube.com/watch?v=WHQOA0hEdoQ