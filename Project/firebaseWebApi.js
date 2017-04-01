function Fit3140() {
	this.shortMotionText = document.getElementById('short');
	this.longMotionText = document.getElementById('long');
	this.motionText = document.getElementById('motion');
	this.intruderMotionText = document.getElementById('intruder');
	this.ledSwitch = document.getElementById('LED');
	this.sensorSwitch = document.getElementById('Sensor');
	this.resetButton = document.getElementById('resetButton');
	this.idVal = 0;

	this.ledSwitch.addEventListener('change', this.saveLedData.bind(this));
	this.sensorSwitch.addEventListener('change', this.saveSensorData.bind(this));
	this.resetButton.addEventListener('click', this.resetDatabase.bind(this));

	this.initFirebase();
	this.loadMotionData();
}

  Fit3140.prototype.initFirebase = function () {
    this.database = firebase.database();
    this.storage = firebase.storage();
  };


  Fit3140.prototype.loadMotionData = function () {
	var totalMotion = 0;
	var longMotion = 0;
	var shortMotion = 0;
	var intruderMotion = 0;
    // Reference to the /messages/ database path.
    this.motionSensorRef = this.database.ref('motionSensorData');
	this.switchRef = this.database.ref('switchData');
    // Make sure we remove all previous listeners.
    this.motionSensorRef.off();
	this.switchRef.off();

    // Loads the last 50 messages and listen for new ones.
    var setData = function (data) {
		var val = data.val();
		totalMotion += 1;
		this.motionText.innerText = totalMotion;
		if (val.type == 'longMotion'){
		longMotion += 1;
		this.longMotionText.innerText = longMotion;
		}
		else if (val.type == 'shortMotion') {
		shortMotion += 1;
		this.shortMotionText.innerText = shortMotion;
		}
		else{
		  intruderMotion += 1;
		  this.intruderMotionText.innerText = intruderMotion;
		}
		console.log(val.type + " added.");
    }.bind(this);
	
	var setSwitch = function(data) {
		var val = data.val();
		if (val.type == 'led'){
			if(val.action == 'on'){
				this.ledSwitch.checked = true;
			}else{
				this.ledSwitch.checked = false;
			}
		}else{
			if(val.action == 'on'){
				this.sensorSwitch.checked = true;
			}else{
				this.sensorSwitch.checked = false;
			}
		}
		console.log(val.type + " " + val.action + " added")
	}.bind(this);
	
	var resetData = function() {
		this.ledSwitch.checked = false;
		this.sensorSwitch.checked = false;
		this.motionText.innerText = 0;
		this.shortMotionText.innerText = 0;
		this.longMotionText.innerText = 0;
		this.intruderMotionText.innerText = 0;
		totalMotion = 0;
		shortMotion = 0;
		longMotion = 0;
		intruderMotion = 0;
		this.idVal = 0;
	}.bind(this);
	
    this.motionSensorRef.on('child_added', setData);
    this.motionSensorRef.on('child_changed', setData);
	this.switchRef.on('child_added', setSwitch);
	this.switchRef.on('child_changed', setSwitch);
	this.switchRef.on('child_removed', resetData);
  };
  
  Fit3140.prototype.saveLedData = function() {
	this.idVal += 1;
	if (this.ledSwitch.checked) {
		this.switchRef.push({
			id: this.idVal,
			action: 'on',
			type: 'led',
			time: Date.now()
		});
	}else {
		this.switchRef.push({
			id: this.idVal,
			action: 'off',
			type: 'led',
			time: Date.now()
		});
	}
  };
  
  Fit3140.prototype.saveSensorData = function() {
	this.idVal += 1;
	if (this.sensorSwitch.checked){
		this.switchRef.push({
			id: this.idVal,
			action: 'on',
			type: 'sensor',
			time: Date.now()
		});
	}else{
		this.switchRef.push({
			id: this.idVal,
			action: 'off',
			type: 'sensor',
			time: Date.now()
		});
	}
  };
  
  Fit3140.prototype.resetDatabase = function() {
	this.motionSensorRef.remove();
	this.switchRef.remove();
  };


window.onload = function () {
	window.Fit3140 = new Fit3140();
};
