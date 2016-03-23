TwentyFour.display = (function () {
	/***
	Private Methods
	***/
	function setScores (){
		var currentScore = 0;
		var bestScore = 0;

		document.querySelector('.current-score').textContent = currentScore;
		document.querySelector('.best-score').textContent = bestScore;
	}

	function setOperations () {
		OperationTiles = TwentyFour.data.getOperations();

		var operationContainer = document.querySelector('.operations-container');
		operationContainer.innerHTML = "";

		for(var op in OperationTiles){
			var newOpTile = createOperationTile(op);
			operationContainer.innerHTML += newOpTile;
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

		return puzzle;
	}

	function setTiles (array) {
		function emptyBeforeNewPuzzle(){
			var selected = document.querySelectorAll('.selected');
			for(var i=0,len=selected.length;i<len;i++){
				selected[i].classList.remove('selected');
			}
			document.querySelector('.numbers-container').innerHTML = "";
			document.querySelector('.current-puzzle-history-container').innerHTML = ""
			TwentyFour.history.emptyCurrentHistory();
		}

		emptyBeforeNewPuzzle();

		var numContainer = document.querySelector('.numbers-container');

		for(var i=0; i < array.length; i++) {
			var newNumberTile = createNumberTile(array[i]);
			numContainer.innerHTML += newNumberTile;
		}

		TwentyFour.hotkeys.setNumberHotKeys();
	}

	/***
	Public Methods
	***/

	function createNumberTile (data){
		return "<div class='number-tile-container'><div class='number-tile' data-value='"+ data + "'><div class='hot-key'></div></div>";
	}

	function createOperationTile (op) {
		return "<div class='operation-tile-container'><div class='operation-tile' data-value='"+ op + "' data-operation='" + TwentyFour.hotkeys.getHotKey(op).keycode + "''><div class='hot-key'>" + TwentyFour.hotkeys.getHotKey(op).shortcut.toUpperCase() + "</div></div></div>";
	}

	function createHistoryElement (history) {
		return "<div class='history-item'><p>Last Move: " + history + "</p></div>";
	}

	function createCurrentScoreElement(currentScore){
		document.querySelector('.current-score').innerHTML= "";
		document.querySelector('.current-score').textContent = currentScore;
	}

	function loginDisplay (logged_in){
		if(logged_in){
			document.querySelector('.login').classList.remove('show')
			document.querySelector('.logout').classList.add('show');
		}
		else{
			document.querySelector('.login').classList.add('show')
			document.querySelector('.logout').classList.remove('show');
		}
	}

	function setupBoard(){
		TwentyFour.timer.setTimer();
		setScores();
		setOperations();
		setTiles(["","","",""]);
	}

	function ready (){
		if(TwentyFour.data.getNumbersData()){
			setTiles(["y","","",""]);
			document.querySelector('.new-game-cta').classList.add('active');
			document.querySelector('.new-game-cta').addEventListener('click', TwentyFour.play.startNewGame())
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
		loginDisplay:loginDisplay,
		setupBoard:setupBoard,
		ready:ready,
		newPuzzle:newPuzzle,
		endOfRound:endOfRound
	};
})();
