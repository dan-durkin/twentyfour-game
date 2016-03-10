TwentyFour.display = (function () {
	function createNumberTile (data){
		return $("<div class='flex-child number-tile tile' data-value='" + data + "'><div class='number-content content'><div><span class='tile-data'>" + data + "</span></div></div><div class='hot-key'>"+"</div></div>");
	}

	function createOperationTile (op) {
		return $("<div class='flex-child operation-tile tile' data-value='"+op+"' data-operation='" + getHotKey(op).keycode + "'><div class='operation-content content'><div><span class='tile-data'>" + op + "</span></div></div><div class='hot-key'>"+ getHotKey(op).shortcut.toUpperCase() +"</div></div>");
	}

	function createHistoryElement (history) {
		return $("<div class='history-item'><p>Last Move: " + history + "</p></div>");
	}
	
	function createCurrentScoreElement(currentScore){
		var currentScoreContainer = $('.current-score');
		currentScoreContainer.empty();
		currentScoreContainer.text(currentScore);
	}
	
	
function newPuzzle(){
	init()
	setTileNumbers();
}

function reset () {
	var selected =$('.selected');
	selected.removeClass('selected');
	moveOperation = null;
	moveNumberTiles = [];
}

function setNewGame(){
	TwentyFour.timer.setTimer();
	setScores();
	setOperations();
}
	
function setScores (){
	var currentScore = 0;
	var bestScore = 0;
	
	var currentScoreContainer = $('.current-score');
	var bestScoreContainer = $('.best-score');
	
	currentScoreContainer.text(currentScore);
	bestScoreContainer.text(bestScore);
}

function setTiles (array) {
	function emptyBeforeNewPuzzle(){
		reset();
		var $numContainer = $('.numbers-container');
		var $currentPuzzleHistoryContainer = $('.current-puzzle-history-container');

		$numContainer.empty();
		$currentPuzzleHistoryContainer.empty();

		currentPuzzleMoves = [];
	}
	
	emptyBeforeNewPuzzle();
	var $numContainer = $('.numbers-container');
	
	for(var i=0; i < array.length; i++) {
		var $newNumberTile = createNumberTile(array[i]);
		$numContainer.append($newNumberTile);
	}
	
	setNumberHotKeys();
	
	if(checkHotKeys()){
		hotKeysOn();
	}
	else{
		hotKeysOff();
	}
}

function setOperations () {
	OperationTiles = getOperations();
	
	var $operationContainer = $('.operations-container');
	$operationContainer.empty();
	
	for(var op in OperationTiles){
		var $newOpTile = createOperationTile(op);
		$operationContainer.append($newOpTile);
	}
}
	
function setTileNumbers () {	
	if(currentPuzzleNumbers){
		setTiles(currentPuzzleNumbers);
		viewCounter();
	}
	else{
		setTimeout(function(){
			setTileNumbers();
		},5);
	}
}
	
function clearRoundHistory (){
	var $roundSolves = $('.round-solves-container');
	$roundSolves.empty();
}

	
	return {
		createNumberTile:createNumberTile,
		createOperationTile:createOperationTile,
		createHistoryElement:createHistoryElement,
		createCurrentScoreElement
	};
})();