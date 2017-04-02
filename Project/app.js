var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://intruder-counter.firebaseio.com"
});

var db = admin.database();                  // reference the database

var motionRef = db.ref("motionSensorData"); // channel for motion sensor data
var switchRef = db.ref("switchData");       // channel for on/off switch data

var jfive = require("johnny-five");  

var board = new jfive.Board();  


board.on("ready", function() {
    var led = new jfive.Led(13);                                                          
    var motion = new jfive.Motion(2);     
    var timer = 0; 	
	var intruderString = "";                                //used to check if pattern == LSLL             
	var idVar = 0;
	var motionVal = false;
	var motStart = false;
	var intruder = "LSLL";
	
	setInterval(function(){                                  //timer to measure length of motion
		timer++;
    }, 1000);
	
	motion.on("motionstart", function(){                     //starts timer when motion detected                                               
		if (motionVal && motStart == false){             //moStart indicates whether motion has started
			motStart = true;
			timer = 0;
			console.log('Motion Start');
		}
	});
		
	motion.on("motionend", function() {             //determine length of motion when motionend event is triggered  
		if (motionVal && motStart){
			console.log('Motion Ended');
			var timeDetected = timer; 
			if (timeDetected > 8) {
				motionRef.push({                     //if long motion, pushing motion data on to firebase
					id: idVar,
					type:'longMotion',
					time_detected: timeDetected
						
				});
				intruderString += "L";	             //appending to string	
			}else{
				motionRef.push({                     //if short motion, do similar things like above for long motion               
					id: idVar,
					type:'shortMotion',
					time_detected: timeDetected	
				});
				intruderString += "S";
			}
			if (intruderString == intruder){             //checking if pattern == LSLL
				idVar += 1;
				motionRef.push({                     //if it is, upload intruder related data onto firebase                     
					id: idVar,
					type:'intruderMotion',
					time_detected: timeDetected
				});
				intruderString = "";
			}else if(intruder.substring(0, intruderString.length) != intruderString){
				intruderString = intruderString.substring(intruderString.length-1, intruderString.length);
			}
			idVar += 1;
			motStart = false;                             //motStart is false as motion has ended
		}		
	});
	
	switchRef.on('child_added', function(data){                   //listen to data under node Switch, every time something new is added
		var value = data.val();
		idVar = value.id;
		if (value.type == 'led'){                             //if it's data about led switch, turn on/off led switch
			if(value.action == 'on'){
				led.on();
			}else{
				led.off();
			}
			console.log("LED turned " + value.action);
		}else{
			if(value.action == 'on'){                     //if it's data about motion sensor,turn on/off motion sensor
				motionVal = true;
			}else{
				motionVal = false;
				motStart = false;
			}
			console.log("Sensor turned " + value.action);
		}	
	});
	
	switchRef.on('child_removed', function(data){                 //If client reset, remove all children under switchRef
		led.off();                                            //resetting variables 
		motionVal = false;
		motStart = false;
		idVar = 0;
		console.log("Data resetted");
	});
		
});	 	
