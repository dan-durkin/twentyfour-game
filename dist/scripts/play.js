TwentyFour.play = (function () {
	var moveOperation = null;
	var moveNumberTiles = [];

	var currentPuzzleMoves = [];
	var currentRoundSolves = [];
	
	function startNewGame () {
		TwentyFour.display.lostGame();
		$(".numbers-container").on("click", ".number-tile", clickHandler);
		$(".operations-container").on("click", ".operation-tile", clickHandler);
		$(window).keydown(TwentyFour.hotkeys.keyHandler);

		TwentyFour.history.clearRoundHistory();
		TwentyFour.display.setNewGame();
		TwentyFour.timer.startTimer();
	}
	
	function getOperations(){
		var OperationTiles = {
			'+':function(a,b){return a+b},
			'-':function(a,b){return a-b},
			'x':function(a,b){return a*b},
			'/':function(a,b){return a/b}
		};

		return OperationTiles;
	}
	
	function operate(moveOperation){
		OperationTiles = getOperations();
		return OperationTiles[moveOperation];
	}

	function clickHandler() {	
		function validMove(element){
			if(element.hasClass("selected") && element.hasClass('number-tile')){
				TwentyFour.display.reset();
			}
			if(moveOperation && element.hasClass('operation-tile')){
				TwentyFour.display.reset();	
			}
			if(moveNumberTiles.length === 2 && element.hasClass('number-tile')){
				TwentyFour.display.reset();
			}
		}

		function storeMove(value, $element){
			if(isNaN(value)){
				moveOperation = value;
			}
			else{
				moveNumberTiles.push({
					value: value,
					element: $element
				});
			}
		}

		function readyToMove(){
			return moveOperation && moveNumberTiles.length === 2;
		}

		var element = $(this);
		validMove(element);

		element.toggleClass("selected");
		storeMove(element.data("value"), element);

		if (readyToMove()){
			performMove();
		}
	}

	function performMove () {
		var result = operate(moveOperation)(moveNumberTiles[0].value, moveNumberTiles[1].value);

		var $numContainer = $('.numbers-container');
		var $newNumberTile = TwentyFour.display.createNumberTile(result);

		$numContainer.prepend($newNumberTile);

		if(TwentyFour.hotkeys.checkHotKeys()){
			TwentyFour.hotkeys.hotKeysOn();
		}

		var historyString = moveNumberTiles[0].value.toString() + ' ' + moveOperation + ' ' + moveNumberTiles[1].value.toString() + ' = ' + result.toString();

		var moveStore = {
			firstNumber: moveNumberTiles[0].value,
			secondNumber: moveNumberTiles[1].value,
			moveOperation: moveOperation,
			firstNumberElement: moveNumberTiles[0].element,
			secondNumberElement: moveNumberTiles[1].element,
			newElement: $newNumberTile,
			historyString: historyString,
			historyElement: TwentyFour.display.createHistoryElement(historyString)
		};

		currentPuzzleMoves.push(moveStore);

		var $historyContainer = $('.current-puzzle-history-container');
		$historyContainer.prepend(moveStore.historyElement);

		var selectedTiles = $('.selected.number-tile');
		selectedTiles.remove();
		TwentyFour.display.reset();
		TwentyFour.hotkeys.setNumberHotKeys();

		if($('.number-tile').length === 1){
			checkSolution($newNumberTile);
		}
	}

	function undoMove () {	
		if(currentPuzzleMoves.length > 0){
			var lastMove = currentPuzzleMoves.pop();
			lastMove.newElement.remove();
			lastMove.historyElement.remove();
			var $numContainer = $('.numbers-container');
			$numContainer.prepend(lastMove.secondNumberElement);
			$numContainer.prepend(lastMove.firstNumberElement);
			TwentyFour.hotkeys.setNumberHotKeys();
		}

		TwentyFour.display.reset();
	}

	function checkSolution($element){
		if($element.data("value") === 24){
			solved($element);
		}
		else{
			incorrect($element);
		}
	}

	function solved ($element){
		$element.addClass('correct');

		setTimeout(function(){
			TwentyFour.score.updateCurrentScore()
			TwentyFour.history.publishHistory();
			TwentyFour.data.solveCounter();
			TwentyFour.display.newPuzzle();
		}, 300);
	}

	function incorrect($element){
		$element.addClass('incorrect');
	}
	
	function skipPuzzle(){
		TwentyFour.data.skipCounter();
		TwentyFour.display.newPuzzle();
	}
	
	return {
		getOperations:getOperations,
		startNewGame:startNewGame,
		undoMove:undoMove,
		skipPuzzle:skipPuzzle
	}
})();


