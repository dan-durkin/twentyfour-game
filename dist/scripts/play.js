TwentyFour.play = (function () {
	var moveOperation = null;
	var moveNumberTiles = [];

	var currentPuzzleMoves = [];
	var currentRoundSolves = [];
	
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
				reset();
			}
			if(moveOperation && element.hasClass('operation-tile')){
				reset();	
			}
			if(moveNumberTiles.length === 2 && element.hasClass('number-tile')){
				reset();
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
		var $newNumberTile = createNumberTile(result);

		$numContainer.prepend($newNumberTile);

		if(checkHotKeys()){
			hotKeysOn();
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
			historyElement: createHistoryElement(historyString)
		};

		currentPuzzleMoves.push(moveStore);

		var $historyContainer = $('.current-puzzle-history-container');
		$historyContainer.prepend(moveStore.historyElement);

		var selectedTiles = $('.selected.number-tile');
		selectedTiles.remove();
		reset();
		setNumberHotKeys();

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
			setNumberHotKeys();
		}

		reset();
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
			updateCurrentScore()
			publishHistory();
			solveCounter();
			newPuzzle();
		}, 300);
	}

	function incorrect($element){
		$element.addClass('incorrect');
	}
	
	function skipPuzzle(){
		skipCounter();
		newPuzzle();
	}
})();


