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
		if(parseInt(this.dataset.value) === 24){
			solved.call(this);
		}
		else{
			incorrect.call(this);
		}
	}

	function solved (){
		this.classList.add('correct');
		TwentyFour.animate.animateRight.call(this);

		setTimeout(function(){
			TwentyFour.score.updateCurrentScore()
			TwentyFour.history.publishHistory();
			TwentyFour.data.solveCounter();
			TwentyFour.display.newPuzzle();
		}, 300);
	}

	function incorrect(){
		this.classList.add('incorrect');
		TwentyFour.animate.animateWrong.call(this);
	}

	function performMove () {
		//Find the Result
		var result = operate(moveObject.move_operation.value)(parseInt(moveObject.numbers_selected[0].value), parseInt(moveObject.numbers_selected[1].value));
		//grab the container
		var numContainer = document.querySelector('.numbers-container');

		// Create a new element with the Result
		TwentyFour.display.numberTileIDManager.increment_id();
		var newNumberTileIndex = TwentyFour.display.numberTileIDManager.get_id();
		var newNumberTile = TwentyFour.display.createNumberTile(result, newNumberTileIndex);

		//Add it to the Dom and select the element
		numContainer.innerHTML += newNumberTile;
		var newNumberElement = document.querySelector('[data-numberindex="' + newNumberTileIndex + '"]');

		//Store the move in a string
		var historyString = moveObject.numbers_selected[0].value.toString() + ' ' + moveObject.move_operation.value + ' ' + moveObject.numbers_selected[1].value.toString() + ' = ' + result.toString();

		//Store data in an object
		var moveStore = {
			firstNumber: moveObject.numbers_selected[0].value,
			secondNumber: moveObject.numbers_selected[1].value,
			moveOperation: moveObject.move_operation,
			firstNumberIndex: moveObject.numbers_selected[0].index,
			firstNumberElement: moveObject.numbers_selected[0].element,
			secondNumberIndex: moveObject.numbers_selected[1].index,
			secondNumberElement: moveObject.numbers_selected[1].element,
			newElement: newNumberElement,
			newElementIndex: newNumberTileIndex,
			historyString: historyString,
			historyElement: TwentyFour.display.createHistoryElement(historyString, TwentyFour.history.getCurrentHistory().length)
		};

		//Unselect everything
		unselectAll();

		//Select the old elements, animate them out, and remove them from the DOM
		var oldEl1 = document.querySelector('[data-numberindex="' + moveStore.firstNumberIndex + '"]').parentElement;
		var oldEl2 = document.querySelector('[data-numberindex="' + moveStore.secondNumberIndex + '"]').parentElement;
		TwentyFour.animate.animateOut.call(oldEl1);
		TwentyFour.animate.animateOut.call(oldEl2);
		numContainer.removeChild(oldEl1);
		numContainer.removeChild(oldEl2);

		//Update history, reset the hotkeys, reset the moveObject
		TwentyFour.history.updateCurrentHistory(moveStore);
		TwentyFour.hotkeys.setNumberHotKeys();
		moveObject.reset();

		//Check the solution OR animate the new element
		if(document.querySelectorAll('.number-tile').length === 1){
			checkSolution.call(newNumberElement);
		}
		else {
			TwentyFour.animate.animateNewElement.call(newNumberElement.parentElement);
		}
	}

	/***
	Public Methods
	***/

	function startNewGame () {
		endOfRound();
		TwentyFour.display.numberTileIDManager.reset_id();
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
				moveObject.numbers_selected.push({value: this.dataset.value, element: this.parentElement, index:this.dataset.numberindex});
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

			var historyContainer = document.querySelector('.current-puzzle-history-container');
			var oldHistoryIndex = document.querySelectorAll('.history-item').length - 1;
			var oldHistoryElement = document.querySelector('[data-historyindex="' + oldHistoryIndex + '"]');
			historyContainer.removeChild(oldHistoryElement);

			var numContainer = document.querySelector('.numbers-container');
			var lastMoveIndex = lastMove.newElementIndex;
			var lastMoveElement = document.querySelector('[data-numberindex="' + lastMoveIndex + '"]');

			var newElement1Index = lastMove.firstNumberIndex;
			var newElement1_temp = TwentyFour.display.createNumberTile(lastMove.firstNumber, newElement1Index);

			var newElement2Index = lastMove.secondNumberIndex;
			var newElement2_temp = TwentyFour.display.createNumberTile(lastMove.secondNumber, newElement2Index);

			TwentyFour.animate.animateOut.call(lastMoveElement);

			setTimeout(function(){
				numContainer.removeChild(lastMoveElement.parentElement)
				numContainer.innerHTML += newElement1_temp;
				numContainer.innerHTML += newElement2_temp;
				var newElement1 = document.querySelector('[data-numberindex="' + newElement1Index + '"]');
				var newElement2 = document.querySelector('[data-numberindex="' + newElement2Index + '"]');
				TwentyFour.animate.animateNewElement.call(newElement1);
				TwentyFour.animate.animateNewElement.call(newElement2);
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
			selectTile.call(document.querySelector('[data-value="+"]'));
			selectTile.call(document.querySelectorAll(".number-tile")[0]);
			selectTile.call(document.querySelectorAll(".number-tile")[1]);
			allTiles = document.querySelectorAll('.number-tile');
		}
	}

	function multiplyAll(){
		var allTiles = document.querySelectorAll('.number-tile');
		while(allTiles.length > 1){
			unselectAll();
			selectTile.call(document.querySelector('[data-value="x"]'));
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
