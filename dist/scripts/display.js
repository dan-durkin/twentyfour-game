TwentyFour.display = (function () {
	function createNumberTile (data){
		return $("<div class='flex-child number-tile tile' data-value='" + data + "'><div class='number-content content'><div><span class='tile-data'>" + data + "</span></div></div><div class='hot-key'>"+"</div></div>");
	}

	function createOperationTile (op) {
		return $("<div class='flex-child operation-tile tile' data-value='"+op+"' data-operation='" + TwentyFour.hotkeys.getHotKey(op).keycode + "'><div class='operation-content content'><div><span class='tile-data'>" + op + "</span></div></div><div class='hot-key'>"+ TwentyFour.hotkeys.getHotKey(op).shortcut.toUpperCase() +"</div></div>");
	}

	function createHistoryElement (history) {
		return $("<div class='history-item'><p>Last Move: " + history + "</p></div>");
	}
	
	function createCurrentScoreElement(currentScore){
		var currentScoreContainer = $('.current-score');
		currentScoreContainer.empty();
		currentScoreContainer.text(currentScore);
	}

	function setNewGame(){
		TwentyFour.timer.setTimer();
		setScores();
		setOperations();
		if(!TwentyFour.data.getNumbersData()){
			setTiles(["","","",""]);
		}
		else{
			setTiles(TwentyFour.data.getNumbersData());
		}
	}	
	
	function newPuzzle(){
		TwentyFour.data.init()
		setTileNumbers();
	}

	function reset () {
		var selected =$('.selected');
		selected.removeClass('selected');
		moveOperation = null;
		moveNumberTiles = [];
	}

	function setScores (){
		var currentScore = 0;
		var bestScore = 0;

		var currentScoreContainer = $('.current-score');
		var bestScoreContainer = $('.best-score');

		currentScoreContainer.text(currentScore);
		bestScoreContainer.text(bestScore);
	}
	
	function setOperations () {
		OperationTiles = TwentyFour.play.getOperations();

		var $operationContainer = $('.operations-container');
		$operationContainer.empty();

		for(var op in OperationTiles){
			var $newOpTile = createOperationTile(op);
			$operationContainer.append($newOpTile);
		}
	}

	function setTiles (array) {
		function emptyBeforeNewPuzzle(){
			reset();
			var $numContainer = $('.numbers-container');
			var $currentPuzzleHistoryContainer = $('.current-puzzle-history-container');

			$numContainer.empty();
			$currentPuzzleHistoryContainer.empty();

			currentPuzzleMoves = [];
		}

		emptyBeforeNewPuzzle();
		var $numContainer = $('.numbers-container');

		for(var i=0; i < array.length; i++) {
			var $newNumberTile = createNumberTile(array[i]);
			$numContainer.append($newNumberTile);
		}

		TwentyFour.hotkeys.setNumberHotKeys();
		if(TwentyFour.hotkeys.checkHotKeys()){
			TwentyFour.hotkeys.hotKeysOn();
		}
		else{
			TwentyFour.hotkeys.hotKeysOff();
		}
	}

	function setTileNumbers () {	
		if(TwentyFour.data.getNumbersData()){
			setTiles(TwentyFour.data.getNumbersData());
			TwentyFour.data.viewCounter();
		}
		else{
			setTimeout(function(){
				setTileNumbers();
			},5);
		}
	}

	function lostGame () {
		reset();
		$(".numbers-container").off("click", ".number-tile", TwentyFour.play.clickHandler);
		$(".operations-container").off("click", ".operation-tile", TwentyFour.play.clickHandler);
		$(window).off("keydown", TwentyFour.hotkeys.keyHandler);
		TwentyFour.hotkeys.hotKeysOff();
	}

	return {
		createNumberTile:createNumberTile,
		createOperationTile:createOperationTile,
		createHistoryElement:createHistoryElement,
		createCurrentScoreElement:createCurrentScoreElement,
		setNewGame:setNewGame,
		lostGame:lostGame,
		newPuzzle:newPuzzle,
		reset:reset
	};
})();