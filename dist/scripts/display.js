TwentyFour.display = (function () {
	/***
	Private Methods
	***/
	function setScores (){
		var currentScore = 0;
		var bestScore = 0;

		var currentScoreContainer = $('.current-score');
		var bestScoreContainer = $('.best-score');

		currentScoreContainer.text(currentScore);
		bestScoreContainer.text(bestScore);
	}
	
	function setOperations () {
		OperationTiles = TwentyFour.data.getOperations();

		var $operationContainer = $('.operations-container');
		$operationContainer.empty();

		for(var op in OperationTiles){
			var $newOpTile = createOperationTile(op);
			$operationContainer.append($newOpTile);
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
	
	function setTiles (array) {
		function emptyBeforeNewPuzzle(){
			$('.selected').removeClass('selected');
			TwentyFour.history.emptyCurrentHistory();
			$('.numbers-container').empty();
			$('.current-puzzle-history-container').empty();
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
	
	/***
	Public Methods
	***/
	
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
	
	function setupBoard(){
		TwentyFour.timer.setTimer();
		setScores();
		setOperations();
		setTiles(["Loading..."]);
	}	
	
	function newPuzzle(){
		TwentyFour.data.init()
		setTileNumbers();
	}
	
	function ready (){		
		if(TwentyFour.data.getNumbersData()){
			setTiles(["","","",""]);
			$('.new-game-cta').addClass('active');
		}
		else{
			setTimeout(function(){
				ready();
			},20);
		}
	}

	return {
		createNumberTile:createNumberTile,
		createOperationTile:createOperationTile,
		createHistoryElement:createHistoryElement,
		createCurrentScoreElement:createCurrentScoreElement,
		setupBoard:setupBoard,
		newPuzzle:newPuzzle,
		ready:ready
	};
})();

/*
function lostGame () {
	reset();
	$(".numbers-container").off("click", ".number-tile", TwentyFour.play.clickHandler);
	$(".operations-container").off("click", ".operation-tile", TwentyFour.play.clickHandler);
	$(window).off("keydown", TwentyFour.hotkeys.keyHandler);
}
*/