TwentyFour.hotkeys = (function () {
	/***
	Private Methods
	***/

	function toggleHotKeys (){
		if(checkHotKeys()){
			hotKeysOff();
		}
		else{
			hotKeysOn();
		}
	}

	function hotKeysOff (){
		var number_hot_keys = document.querySelectorAll('.number-hot-key');
		for (var i=0,len=number_hot_keys.length;i<len;i++){
			number_hot_keys[i].classList.remove('show');
		}
		var op_hot_keys = document.querySelectorAll('.operation-hot-key');
		for (var i=0,len=op_hot_keys.length;i<len;i++){
			op_hot_keys[i].classList.remove('show');
		}
		var utility_hot_keys = document.querySelectorAll('.utility-hot-key');
		for (var i=0,len=utility_hot_keys .length;i<len;i++){
			utility_hot_keys[i].classList.remove('show');
		}
		document.querySelector('.helper-hot-keys').classList.remove('show');
	}

	function hotKeysOn (){
		var number_hot_keys = document.querySelectorAll('.number-hot-key');
		for (var i=0,len=number_hot_keys.length;i<len;i++){
			number_hot_keys[i].classList.add('show');
		}
		var op_hot_keys = document.querySelectorAll('.operation-hot-key');
		for (var i=0,len=op_hot_keys.length;i<len;i++){
			op_hot_keys[i].classList.add('show');
		}
		var utility_hot_keys = document.querySelectorAll('.utility-hot-key');
		for (var i=0,len=utility_hot_keys .length;i<len;i++){
			utility_hot_keys[i].classList.add('show');
		}
		document.querySelector('.helper-hot-keys').classList.add('show');
	}

	function checkHotKeys (){
		return document.querySelector('.number-hot-key').classList.contains('show');
	}

	/***
	Public Methods
	***/

	function keyHandler (event){
		switch(event.which){
			case 32:
				toggleHotKeys();
				break;
			// Purposely fallling through
			case 81:
			case 87:
			case 69:
			case 82:
				TwentyFour.play.selectTile.call(document.querySelector('[data-operation="' + event.which + '"]'));
				break;
			case 49:
			case 50:
			case 51:
			case 52:
				TwentyFour.play.selectTile.call(document.querySelectorAll(".number-tile")[getHotKey(event.which).index]);
				break;
			case 37:
				TwentyFour.play.undoMove();
				break;
			case 39:
				TwentyFour.play.skipPuzzle();
				break;
			case 65:
				TwentyFour.play.addAll();
				break;
			case 83:
				TwentyFour.play.multiplyAll();
				break;
			default:
				break;
		}
	}

	function getHotKey (key){
		var hotKeys = {
			'+':{keycode: 81, shortcut: 'q'},
			'-':{keycode: 87, shortcut: 'w'},
			'x':{keycode: 69, shortcut: 'e'},
			'/':{keycode: 82, shortcut: 'r'},
			'49':{keycode:49, index: 0},
			'50':{keycode:50, index: 1},
			'51':{keycode:51, index: 2},
			'52':{keycode:52, index: 3},
		}

		return hotKeys[key];
	}

	function setNumberHotKeys(){
		var hot_keys = document.querySelectorAll('.number-hot-key');
		for (var i=0,len=hot_keys.length;i<len;i++){
			hot_keys[i].textContent = i + 1;
		}

		if(checkHotKeys()){
			hotKeysOn();
		}
		else{
			hotKeysOff();
		}
	}

	function endOfRound(){
		hotKeysOff();
	}

	return {
		keyHandler: keyHandler,
		getHotKey: getHotKey,
		setNumberHotKeys:setNumberHotKeys,
		endOfRound:endOfRound
	};
})();
