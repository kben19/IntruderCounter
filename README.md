# assignment-2-team64
## Project Members
* Kelvin Benzali - 26445468
* Jason Xu - 25978012

## Project Description
Project Title: Intruder Counter

Description: Intruder counter is an application implemented by Node.js to control and connect between IoT kit and server by using firebase server. The application functionality is to detect any short, long and intruder motion from motion sensor.

## Hardware Structures
This project is designed to execute for IoT device. Therefore, the project needs several hardware components in order to execute successfully. Below the list of the required hardware components:

* Microcontroller Board Arduino Uno
* USB Cable 
* Led 
* Motion Sensor
* Jumper Cables

## Digital pins on Arduino Board
* Digital pin used to connect Led is pin 13
* Digital pin used to connect the motion sensor is pin 2

## Platform//architecture
* Node js
* Firebase

Client.html is a webpage that allowes the user to view the data stored on Firbase Realtime DB, it also has the abilities to switch on/off the motion sensor and the LED.
Package.json provides a documentation about the program.

## Library Required
Library Required in the project
* johnny-five
* firebase-admin
* firebase-tools

## Functions
The client can invoke several functions, these are:

* Displaying data fetched from Firebase Realtime DB.
* Switching on/off the LED
* Switching on/off the PIR motion sensor
* Measuring length of movement and distinguishes whether it's a long motion or short motion.
* Clearing all stored data in Firebase Realtime DB.


## Known bugs
No bugs were detected during testing.

## Assumptions
The server does not handle multiple sessions, there is only one client.

If the client restart(refresh) during the middle of intruder calculations, it must be able to fetch old data from the server and find the total number of intruders and still be able to perform all functionalities required in the project scope.
