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
		function shuffle(array) {
		  var m = array.length, t, i;

		  // While there remain elements to shuffle…
		  while (m) {

			// Pick a remaining element…
			i = Math.floor(Math.random() * m--);

			// And swap it with the current element.
			t = array[m];
			array[m] = array[i];
			array[i] = t;
		  }

		  return array;
		}
		
		var puzzle = shuffle(TwentyFour.data.getNumbersData());
		setTiles(puzzle);
		TwentyFour.data.viewCounter();
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
	
	function newPuzzle(){
		TwentyFour.data.init()
		setTileNumbers();
	}
	
	function endOfRound (){
		setTiles(["","","",""]);
	}

	return {
		createNumberTile:createNumberTile,
		createOperationTile:createOperationTile,
		createHistoryElement:createHistoryElement,
		createCurrentScoreElement:createCurrentScoreElement,
		setupBoard:setupBoard,
		ready:ready,
		newPuzzle:newPuzzle,
		endOfRound:endOfRound
	};
})();