TwentyFour.play = (function () {
	/***
	Private Variables
	***/

	var moveOperation = null;
	var moveNumberTiles = [];

	/***
	Private Methods
	***/
	function eventListenerManager (active_game){
		number_tiles = document.querySelectorAll('.number-tile');
		operation_tiles = document.querySelectorAll('.number-tile');

		if(active_game){
			for(var i, len = number_tiles.length; i<len; i++){
				number_tiles[i].addEventListener("click", TwentyFour.play.selectTile);
			}
			for(var i, len = number_tiles.length; i<len; i++){
				operation_tiles[i].addEventListener("click", TwentyFour.play.selectTile);
			}
			document.querySelector('.login-btn').addEventListener("click", TwentyFour.login.facebookLogin);
			document.querySelector('.logout-btn').addEventListener("click", TwentyFour.login.logout);
			document.querySelector('.undo-tile').addEventListener("click", TwentyFour.play.undoMove);
			document.querySelector('.skip-tile').addEventListener("click", TwentyFour.play.skipPuzzle);
			document.addEventListener("keydown", TwentyFour.hotkeys.keyHandler);
		}else{
			for(var i, len = number_tiles.length; i<len; i++){
				number_tiles[i].removeEventListener("click", TwentyFour.play.selectTile);
			}
			for(var i, len = number_tiles.length; i<len; i++){
				operation_tiles[i].removeEventListener("click", TwentyFour.play.selectTile);
			}
			document.querySelector('.login-btn').removeEventListener("click", TwentyFour.login.facebookLogin);
			document.querySelector('.logout-btn').removeEventListener("click", TwentyFour.login.logout);
			document.querySelector('.undo-tile').removeEventListener("click", TwentyFour.play.undoMove);
			document.querySelector('.skip-tile').removeEventListener("click", TwentyFour.play.skipPuzzle);
			document.removeEventListener("keydown", TwentyFour.hotkeys.keyHandler);
		}
	}

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
			solved($element);
		}
		else{
			incorrect($element);
		}
	}

	function solved (){
		addClass('correct');
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
		var $selectedTiles = $('.selected.number-tile-container');
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
		endOfRound();

		TwentyFour.history.emptyCurrentHistory();
		TwentyFour.history.clearRoundHistory();
		TwentyFour.display.setupBoard();
		TwentyFour.display.newPuzzle();
		TwentyFour.animate.animateNewGame();
		//TwentyFour.timer.startTimer();

		eventListenerManager(true);
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
			var numContainer = document.querySelector('.numbers-container');
			var lastMove = TwentyFour.history.getCurrentHistory().pop();

			lastMove.historyElement.remove();
			TwentyFour.animate.animateOut(lastMove.newElement);
			TwentyFour.animate.animateNewElement(lastMove.secondNumberElement);
			TwentyFour.animate.animateNewElement(lastMove.firstNumberElement);

			setTimeout(function(){
				lastMove.newElement.remove();
				numContainer.innerHTML += lastMove.secondNumberElement;
				numContainer.innerHTML += lastMove.firstNumberElement;
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
		var allTiles = document.querySelectorAll('.number-tile');
		while(allTiles.length > 1){
			selectTile.call(document.querySelectorAll('[data-value="+"]'));
			selectTile.call(document.querySelectorAll(".number-tile")[0]);
			selectTile.call(document.querySelectorAll(".number-tile")[1]);
			allTiles = document.querySelectorAll('.number-tile');
			reset();
		}
	}

	function multiplyAll(){
		var allTiles = document.querySelectorAll('.number-tile');
		while(allTiles.length > 1){
			selectTile.call(document.querySelectorAll('[data-value="x"]'));
			selectTile.call(document.querySelectorAll(".number-tile")[0]);
			selectTile.call(document.querySelectorAll(".number-tile")[1]);
			allTiles = document.querySelectorAll('.number-tile');
			reset();
		}
	}

	function endOfRound () {
		reset();
		eventListenerManager(false);

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
