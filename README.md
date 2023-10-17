# RoomOSRebootScheduler

A simple tool for scheduling automatic reboots of Cisco RoomOS devices. Adjust reboot trigger time window and time-check interval in Python code to control when the server initiates a reboot.

## Codec Functionality

Included in the Codec Files folder are the necessary UI Extension files (xml) and Macro file (javascript).
When the backend server initiates a reboot, the device is woken up (if asleep or half-awake) and an alert displays, warning potential users that the codec is about to restart.
After several seconds, a countdown will be shown both on the display and the Touch 10/Room Navigator with an option to cancel the reboot.
Should a user accidentally dismiss the cancel window on the touchpanel, a button is displayed flashing orange and red, which will also cancel the reboot. Once the countdown hits zero, the codec reboots.

## Python Server functionality

When started, the NightlyReboot.py process periodically checks the time according the the 'interval' variable value. Once the time-check occurs during the automatic reboot window, the script
pulls a list of Cisco device IPs from a .xlsx file in the root directory and sends commands to wake up the device and initiate the reboot script. The status code returned from each device
is saved in the next column of the .xlsx file for logging purposes.

## DEPENDENCIES AND REQUIREMENTS

Python Packages:  
openpyxl - python excel editor  
requests - simple http request library  
python-dotenv - enables use of .env file for environmental variables  

Environment Variables:  
PASSWORD - base64 encoded credentials for the devices  
FILENAME - the name of the .xlsx file in the root directory that contains the IP addresses NOTE: Ips must be in Column C of the .xlsx file. Returned stats codes are saved in column D.  

Room OS Versions Tested:  
  Room Series:  
    Room OS 10.19  
    Room OS 11.7  
  Desk Series:  
    Pending  

