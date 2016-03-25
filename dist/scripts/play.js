TwentyFour.play = (function () {
	/***
	Private Variables
	***/

	var is_active = false;

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
		resetNumberSelection:function(){
			this.numbers_selected = []
		},
		removeNumberSelection:function(index){
			this.numbers_selected.splice(index,1);
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

	function unselectAll () {
		var selected = document.querySelectorAll('.selected');
		for (var i = 0, len = selected.length; i < len; i++) {
			selected[i].classList.remove('selected');
		}
	}

	function unselectAllNumberTiles () {
		var selected = document.querySelectorAll('.number-tile.selected');
		for (var i = 0, len = selected.length; i < len; i++) {
			selected[i].classList.remove('selected');
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
		this.classList.add('correct');
		TwentyFour.animate.animateRight();

		setTimeout(function(){
			TwentyFour.score.updateCurrentScore()
			TwentyFour.history.publishHistory();
			TwentyFour.data.solveCounter();
			TwentyFour.display.newPuzzle();
		}, 300);
	}

	function incorrect(){
		this.classList.add('incorrect');
		TwentyFour.animate.animateWrong();
	}

	function performMove () {
		var result = operate(moveObject.move_operation.value)(parseInt(moveObject.numbers_selected[0].value), parseInt(moveObject.numbers_selected[1].value));

		var numContainer = document.querySelector('.numbers-container');
		var newNumberTileIndex = document.querySelectorAll('.number-tile').length;
		var newNumberTile = TwentyFour.display.createNumberTile(result, newNumberTileIndex);

		unselectAll();
		numContainer.removeChild(moveObject.numbers_selected[0].element);
		numContainer.removeChild(moveObject.numbers_selected[1].element);
		numContainer.innerHTML += newNumberTile;
		var newNumberElement = document.querySelector('[data-numberindex="' + newNumberTileIndex + '"]');

		var historyString = moveObject.numbers_selected[0].value.toString() + ' ' + moveObject.move_operation.value + ' ' + moveObject.numbers_selected[1].value.toString() + ' = ' + result.toString();

		var moveStore = {
			firstNumber: moveObject.numbers_selected[0].value,
			secondNumber: moveObject.numbers_selected[1].value,
			moveOperation: moveObject.move_operation,
			firstNumberElement: moveObject.numbers_selected[0].element,
			secondNumberElement: moveObject.numbers_selected[1].element,
			newElement: newNumberElement,
			historyString: historyString,
			historyElement: TwentyFour.display.createHistoryElement(historyString, TwentyFour.history.getCurrentHistory().length)
		};

		moveObject.reset();

		TwentyFour.history.updateCurrentHistory(moveStore);
		TwentyFour.hotkeys.setNumberHotKeys();

		if(document.querySelectorAll('.number-tile').length === 1){
			checkSolution.call(newNumberElement);
		}
		else {
			TwentyFour.animate.animateNewElement.call(newNumberElement);
		}
	}

	/***
	Public Methods
	***/

	function startNewGame () {
		endOfRound();
		is_active = true;
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
				this.classList.remove('selected');
				moveObject.resetMoveOperation();
			}
			else if (this.classList.contains("number-tile")) {
				var og_element = this;
				var i = -1;
				moveObject.numbers_selected.findIndex(function(el,index){
					if(og_element === el.element.childNodes[0]){
						i = index;
					}
				});

				if(i>-1){
					moveObject.removeNumberSelection(i);
				}
			}
		}

		function addToMoveObject(){
			if(this.classList.contains("operation-tile")){
				if(moveObject.readyOperations()){
					this.classList.remove('selected');
					moveObject.resetMoveOperation();
				}
				moveObject.move_operation = {value: this.dataset.value, element: this.parentElement}
			}
			else if (this.classList.contains("number-tile")) {
				if(moveObject.readyNumbersSelected()){
					unselectAllNumberTiles();
					moveObject.resetNumberSelection();
				}
				moveObject.numbers_selected.push({value: this.dataset.value, element: this.parentElement});
			}
		}

		var element = this;

		if(is_active && element.classList.contains("selected")){
			removeFromMoveObject.call(element);
			element.classList.remove("selected");
		}else{
			addToMoveObject.call(element);
			element.classList.add("selected");
		}

		if (is_active && moveObject.readyToMove()){
			performMove();
		}
	}

	function undoMove () {
		if(TwentyFour.history.getCurrentHistory().length > 0 && is_active){
			var lastMove = TwentyFour.history.getCurrentHistory().pop();
			debugger;
			var historyContainer = document.querySelector('.current-puzzle-history-container');
			var oldHistoryIndex = document.querySelectorAll('.history-item').length;
			var oldHistoryElement = document.querySelector('[data-historyindex="' + oldHistoryIndex + '"]');
			historyContainer.removeChild(oldHistoryElement);

			var numContainer = document.querySelector('.numbers-container');
			var lastMoveIndex = document.querySelectorAll('.number-tile').length - 1;
			var lastMoveElement = document.querySelector('[data-historyindex="' + lastMoveIndex + '"]');
			
			TwentyFour.animate.animateOut.call(lastMoveElement);
			TwentyFour.animate.animateNewElement.call(lastMove.secondNumberElement);
			TwentyFour.animate.animateNewElement.call(lastMove.firstNumberElement);

			setTimeout(function(){
				numContainer.removeChild(lastMoveElement)
				numContainer.innerHTML += lastMove.secondNumberElement;
				numContainer.innerHTML += lastMove.firstNumberElement;
				TwentyFour.hotkeys.setNumberHotKeys();
			}, 250);
		}

		unselectAll();
	}

	function skipPuzzle(){
		if (is_active) {
			TwentyFour.data.skipCounter();
			TwentyFour.display.newPuzzle();
			TwentyFour.animate.animateNewPuzzle();
		}
	}

	function addAll(){
		var allTiles = document.querySelectorAll('.number-tile');
		while(allTiles.length > 1){
			unselectAll();
			lastMove.newElementselectTile.call(document.querySelectorAll('[data-value="+"]'));
			selectTile.call(document.querySelectorAll(".number-tile")[0]);
			selectTile.call(document.querySelectorAll(".number-tile")[1]);
			allTiles = document.querySelectorAll('.number-tile');
		}
	}

	function multiplyAll(){
		var allTiles = document.querySelectorAll('.number-tile');
		while(allTiles.length > 1){
			unselectAll();
			selectTile.call(document.querySelectorAll('[data-value="x"]'));
			selectTile.call(document.querySelectorAll(".number-tile")[0]);
			selectTile.call(document.querySelectorAll(".number-tile")[1]);
			allTiles = document.querySelectorAll('.number-tile');
		}
	}

	function endOfRound () {
		unselectAll();
		is_active = false;
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
		endOfRound:endOfRound,
	}
})();
