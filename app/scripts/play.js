TwentyFour.play = (function () {
	/***
	Private Variables
	***/

	var moveObject = {
		move_operation:{},
		numbers_selected: [],
		reset:function(){
			this.move_operation = {},
			this.numbers_selected = []
		},
		resetMoveOperation:function(){
			this.move_operation = {}
		},
		resetNumberSelection:function(index){
			this.numbers_selected = this.numbers_selected.splice(index,index+1);
		},
		readyOperations:function(){
			return this.move_operation.hasOwnProperty('value') && this.move_operation.hasOwnProperty('element')
		},
		readyNumbersSelected:function(){
			return this.numbers_selected.length == 2 && this.numbers_selected[0].hasOwnProperty('value') && this.numbers_selected[0].hasOwnProperty('element') && this.numbers_selected[1].hasOwnProperty('value') && this.numbers_selected[1].hasOwnProperty('element');
		},
		readyToMove:function(){
			return this.readyOperations() && this.readyNumbersSelected();
		}
	};

	/***
	Private Methods
	***/

	function reset () {
		var selected = document.querySelectorAll('.selected');
		for (var i = 0, len = selected.length; i < len; i++) {
			selected.classList.remove('selected');
		}
	}

	function operate(moveOperation){
		OperationTiles = TwentyFour.data.getOperations();
		return OperationTiles[moveOperation];
	}

	function checkSolution(){
		if(this.dataset.value === 24){
			solved.call(this);
		}
		else{
			incorrect.call(this);
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

	function incorrect(){
		this.addClass('incorrect');
		TwentyFour.animate.animateWrong();
	}

	function performMove () {
		//debugger;
		var result = operate(moveObject.move_operation.value)(parseInt(moveObject.numbers_selected[0].value), parseInt(moveObject.numbers_selected[1].value));

		var numContainer = document.querySelector('.numbers-container');
		var newNumberTile = TwentyFour.display.createNumberTile(result);

		var historyString = moveObject.numbers_selected[0].value.toString() + ' ' + moveObject.move_operation.value + ' ' + moveObject.numbers_selected[1].value.toString() + ' = ' + result.toString();

		var moveStore = {
			firstNumber: moveObject.numbers_selected[0].value,
			secondNumber: moveObject.numbers_selected[1].value,
			moveOperation: moveObject.move_operation,
			firstNumberElement: moveObject.numbers_selected[0].element,
			secondNumberElement: moveObject.numbers_selected[1].element,
			newElement: newNumberTile,
			historyString: historyString,
			historyElement: TwentyFour.display.createHistoryElement(historyString)
		};
		debugger;
		numContainer.removeChild(moveObject.numbers_selected[0].element);
		numContainer.removeChild(moveObject.numbers_selected[1].element);
		numContainer.innerHTML += newNumberTile;

		moveObject.reset();
		reset();

		TwentyFour.history.updateCurrentHistory(moveStore);
		TwentyFour.hotkeys.setNumberHotKeys();

		if(document.querySelectorAll('.number-tile').length === 1){
			checkSolution.call(newNumberTile);
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
	}

	function selectTile() {

		function removeFromMoveObject(){
			if(this.classList.contains("operation-tile")){
				moveObject.resetMoveOperation();
			}
			else if (this.classList.contains("number-tile")) {
				var i = moveObject.numbers_selected.indexOf({value: this.dataset.value, element: this});
				moveObject.resetNumberSelection(i);
			}
		}

		function addToMoveObject(){
			if(this.classList.contains("operation-tile")){
				if(moveObject.readyOperations()){
					moveObject.resetMoveOperation();
				}
				moveObject.move_operation = {value: this.dataset.value, element: this.parentElement}
			}
			else if (this.classList.contains("number-tile")) {
				if(moveObject.readyNumbersSelected()){
					moveObject.resetNumberSelection();
				}
				moveObject.numbers_selected.push({value: this.dataset.value, element: this.parentElement});
			}
		}

		var element = this;

		if(element.classList.contains("selected")){
			element.classList.remove("selected");
			removeFromMoveObject.call(element);
		}else{
			element.classList.add("selected");
			addToMoveObject.call(element);
		}

		if (moveObject.readyToMove()){
			performMove();
		}
	}

	function undoMove () {
		if(TwentyFour.history.getCurrentHistory().length > 0){
			var historyContainer = document.querySelector('current-puzzle-history-container');
			var numContainer = document.querySelector('.numbers-container');
			var lastMove = TwentyFour.history.getCurrentHistory().pop();

			historyContainer.removeChild(lastMove.historyElement);

			TwentyFour.animate.animateOut(lastMove.newElement);
			TwentyFour.animate.animateNewElement(lastMove.secondNumberElement);
			TwentyFour.animate.animateNewElement(lastMove.firstNumberElement);

			setTimeout(function(){
				numContainer.removeChild(lastMove.newElement)
				numContainer.innerHTML += lastMove.secondNumberElement;
				numContainer.innerHTML += lastMove.firstNumberElement;
				TwentyFour.hotkeys.setNumberHotKeys();
			}, 250);
		}

		reset();
	}

	function skipPuzzle(){
		if (isActive) {
			TwentyFour.data.skipCounter();
			TwentyFour.display.newPuzzle();
			TwentyFour.animate.animateNewPuzzle();
		}
	}

	function addAll(){
		var allTiles = document.querySelectorAll('.number-tile');
		while(allTiles.length > 1){
			reset();
			lastMove.newElementselectTile.call(document.querySelectorAll('[data-value="+"]'));
			selectTile.call(document.querySelectorAll(".number-tile")[0]);
			selectTile.call(document.querySelectorAll(".number-tile")[1]);
			allTiles = document.querySelectorAll('.number-tile');
		}
	}

	function multiplyAll(){
		var allTiles = document.querySelectorAll('.number-tile');
		while(allTiles.length > 1){
			reset();
			selectTile.call(document.querySelectorAll('[data-value="x"]'));
			selectTile.call(document.querySelectorAll(".number-tile")[0]);
			selectTile.call(document.querySelectorAll(".number-tile")[1]);
			allTiles = document.querySelectorAll('.number-tile');
		}
	}

	function endOfRound () {
		reset();

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
