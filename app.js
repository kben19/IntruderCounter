var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://intruder-counter.firebaseio.com"
});



var db = admin.database();

var ref = db.ref("/motionSensorData"); // channel name

var jfive = require("johnny-five");   


board.on("ready", function() {
    var led = new jfive.Led(13);                                                          
    var motion = new jfive.Motion(2);     
    var timer = 0; 	
	
	var idVar = 0;
	
	var motionVar = 'off';           //motion sensor switch
	
	

		setInterval(function(){                                                             //timer to measure length of motion
			timer++;
			}, 1000);
		socket.on('checkbox1', function(ledVar){		                                    
            ledVar == 'on' ? led.on() : led.off();                                                                                   
            console.log('LED is turned ', ledVar);
            });
		
		socket.on('checkbox2', function(motVar){                                            
			motVar == 'on' ? motionVar = 'on' : motionVar = 'off'
			console.log('Motion Sensor is turned ', motVar);
			});
		
		
		
		
		
		motion.on("motionstart", function(){                                                //starts timer when motion detected                                               
			if (motionVar == 'on') {
				
				timer = 0;
				console.log('Motion Start');
			}
		});
		
		
		motion.on("motionend", function() {                                                 //determine length of motion when motionend event is triggered             
			if (motionVar == 'on') {
				console.log('Motion Ended');
				var timeDetected = timer;                                        
				if (timeDetected > 10) {
					
					ref.push({
						
					    id: idVar,
                      
					    type:'longMotion'
						
						time: timeDetected
					
				    });
					
					
                }else{
					ref.push({
                       
					    id: idVar,
                        
				        type:'shortMotion',
						
						time: timeDetected
                    
					});
				}
				
			}
		}); //setInterval


});	 //for board		
