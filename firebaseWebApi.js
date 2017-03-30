var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://intruder-counter.firebaseio.com"
});



var db = admin.database();

var ref = db.ref("/motionSensorData"); // channel name

var array = [];

var intruder = 0;

ref.on('child_added',processData);  //everytime a child is added process its data


function processData(data){
	
	var motion = data.val();

	
	var motion_type = motion.type;
	
		
	array.push(motion_type);
		
	if (array.length = 4){
		
		if ((array[0] == 'longMotion') && (array[1] == 'shortMotion') && (array[2] == 'longMotion') && (array[3] == 'longMotion'))
				
			intruder += 1;
				
			array = [];
				
		}else{
				
			var new_array = array.slice(1,4);              //remove the 1st element
			    
			array = new_array;
				
		}
	}		
		
}