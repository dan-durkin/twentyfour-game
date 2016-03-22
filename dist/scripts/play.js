TwentyFour.play = (function () {
	/***
	Private Variables
	***/

	var moveOperation = null;
	var moveNumberTiles = [];

	/***
	Private Methods
	***/

	function reset () {
		var $selectedTiles =$('.selected');
		$selectedTiles.removeClass('selected');
		moveOperation = null;
		moveNumberTiles = [];
	}

	function operate(moveOperation){
		OperationTiles = TwentyFour.data.getOperations();
		return OperationTiles[moveOperation];
	}

	function checkSolution($element){
		if($element.data("value") === 24){
			solved.call($element);
		}
		else{
			incorrect($element);
		}
	}

	function solved (){
		this.addClass('correct');
		TwentyFour.animate.animateRight();

		setTimeout(function(){
			TwentyFour.score.updateCurrentScore()
			TwentyFour.history.publishHistory();
			TwentyFour.data.solveCounter();
			TwentyFour.display.newPuzzle();
		}, 300);
	}

	function incorrect($element){
		$element.addClass('incorrect');
		TwentyFour.animate.animateWrong();
	}

	function performMove () {
		var result = operate(moveOperation)(moveNumberTiles[0].value, moveNumberTiles[1].value);

		var $numContainer = $('.numbers-container');
		var $selectedTiles = $('.selected.number-tile');
		var $newNumberTile = TwentyFour.display.createNumberTile(result);

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


		$selectedTiles.remove();
		reset();
		$numContainer.prepend($newNumberTile);

		TwentyFour.history.updateCurrentHistory(moveStore);
		TwentyFour.hotkeys.setNumberHotKeys();

		if($('.number-tile').length === 1){
			checkSolution($newNumberTile);
		}
		else {
			TwentyFour.animate.animateNewElement(moveStore.newElement);
		}
	}

	/***
	Public Methods
	***/

	function startNewGame () {
		reset();
		endOfRound();
		$(".numbers-container").on("click",".number-tile", TwentyFour.play.selectTile);
		$(".operations-container").on("click",".operation-tile", TwentyFour.play.selectTile);
		$(window).on("keydown",TwentyFour.hotkeys.keyHandler);

		TwentyFour.history.emptyCurrentHistory();
		TwentyFour.history.clearRoundHistory();
		TwentyFour.display.setupBoard();
		TwentyFour.display.newPuzzle();
		TwentyFour.animate.animateNewGame();
		TwentyFour.timer.startTimer();
	}

	function selectTile() {
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

	function undoMove () {
		if(TwentyFour.history.getCurrentHistory().length > 0){
			var $numContainer = $('.numbers-container');
			var lastMove = TwentyFour.history.getCurrentHistory().pop();

			lastMove.historyElement.remove();
			TwentyFour.animate.animateOut(lastMove.newElement);
			TwentyFour.animate.animateNewElement(lastMove.secondNumberElement);
			TwentyFour.animate.animateNewElement(lastMove.firstNumberElement);

			setTimeout(function(){
				lastMove.newElement.remove();
				$numContainer.prepend(lastMove.secondNumberElement);
				$numContainer.prepend(lastMove.firstNumberElement);
				TwentyFour.hotkeys.setNumberHotKeys();
			}, 250);
		}

		reset();
	}

	function skipPuzzle(){
		TwentyFour.data.skipCounter();
		TwentyFour.display.newPuzzle();
		TwentyFour.animate.animateNewPuzzle();
	}

	function addAll(){
		var allTiles = $('.number-tile');
		while(allTiles.length > 1){
			selectTile.call(document.querySelectorAll('[data-value="+"]'));
			selectTile.call(document.querySelectorAll(".number-tile")[0]);
			selectTile.call(document.querySelectorAll(".number-tile")[1]);
			allTiles = $('.number-tile');
			reset();
		}
	}

	function multiplyAll(){
		var allTiles = $('.number-tile');
		while(allTiles.length > 1){
			selectTile.call(document.querySelectorAll('[data-value="x"]'));
			selectTile.call(document.querySelectorAll(".number-tile")[0]);
			selectTile.call(document.querySelectorAll(".number-tile")[1]);
			allTiles = $('.number-tile');
			reset();
		}
	}

	function endOfRound () {
		reset();
		$(".numbers-container").off("click", ".number-tile", TwentyFour.play.clickHandler);
		$(".operations-container").off("click", ".operation-tile", TwentyFour.play.clickHandler);
		$(window).off("keydown", TwentyFour.hotkeys.keyHandler);
		TwentyFour.display.endOfRound();
		TwentyFour.hotkeys.endOfRound();
	}

	return {
		startNewGame:startNewGame,
		selectTile:selectTile,
		undoMove:undoMove,
		skipPuzzle:skipPuzzle,
		addAll:addAll,
		multiplyAll:multiplyAll,
		endOfRound:endOfRound
	}
})();
