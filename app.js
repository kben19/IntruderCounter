var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://intruder-counter.firebaseio.com"
});

var db = admin.database();

var motionRef = db.ref("motionSensorData"); // channel name
var switchRef = db.ref("switchData");

var jfive = require("johnny-five");  

var board = new jfive.Board();  


board.on("ready", function() {
    var led = new jfive.Led(13);                                                          
    var motion = new jfive.Motion(2);     
    var timer = 0; 	
	var intruderString = "";
	var idVar = 0;
	var motionVal = false;
	var motStart = false;
	var intruder = "LSLL";
	
	setInterval(function(){                                  //timer to measure length of motion
		timer++;
    }, 1000);
	
	motion.on("motionstart", function(){                                                //starts timer when motion detected                                               
		if (motionVal && motStart == false){
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
				motionRef.push({
					id: idVar,
					type:'longMotion',
					time_detected: timeDetected
						
				});
				intruderString += "L";		
			}else{
				motionRef.push({
					id: idVar,
					type:'shortMotion',
					time_detected: timeDetected	
				});
				intruderString += "S";
			}
			if (intruderString == intruder){
				idVar += 1;
				motionRef.push({
					id: idVar,
					type:'intruderMotion',
					time_detected: timeDetected
				});
				intruderString = "";
			}else if(intruder.substring(0, intruderString.length) != intruderString){
				intruderString = intruderString.substring(intruderString.length-1, intruderString.length);
			}
			idVar += 1;
			motStart = false;
		}		
	});
	
	switchRef.on('child_added', function(data){
		var value = data.val();
		idVar = value.id;
		if (value.type == 'led'){
			if(value.action == 'on'){
				led.on();
			}else{
				led.off();
			}
			console.log("LED turned " + value.action);
		}else{
			if(value.action == 'on'){
				motionVal = true;
			}else{
				motionVal = false;
				motStart = false;
			}
			console.log("Sensor turned " + value.action);
		}	
	});
	
	switchRef.on('child_removed', function(data){
		led.off();
		motionVal = false;
		motStart = false;
		idVar = 0;
		console.log("Data resetted");
	});
		
});	 //for board		
