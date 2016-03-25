TwentyFour.hotkeys = (function () {
	/***
	Private Methods
	***/

	function toggleHotKeys (){
		if(checkHotKeys()){
			hotKeysOn();
		}
		else{
			hotKeysOff();
		}
	}

	function hotKeysOff (){
		$('.hot-key').removeClass('show');
		$('.undo').removeClass('show');
		$('.skip').removeClass('show');
		$('.utility-hot-key').removeClass('show');
	}

	function hotKeysOn (){
		$('.hot-key').addClass('show');
		$('.undo').addClass('show');
		$('.skip').addClass('show');
		$('.utility-hot-key').addClass('show');
	}

	function checkHotKeys (){
		return $('.hot-key').hasClass('show');
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
		$('.hot-key.number-tile').empty();
		$('.number-tile').each(function (num, element){
			$(this).children('.hot-key').text(num + 1);
		});

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
