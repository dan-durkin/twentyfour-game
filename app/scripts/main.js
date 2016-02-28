function createNumberTile (data){
	return $("<div class='flex-child number-tile tile' data-value='" + data + "'><div class='number-content content'><div><span class='tile-data'>" + data + "</span></div></div></div>");
}
	
function createOperationTile (op) {
	return $("<div class='flex-child operation-tile tile' data-value='" + op + "'><div class='operation-content content'><div><span class='tile-data'>" + op + "</span></div></div></div>");
}

function createHistoryElement (history) {
	return $("<div class='history-item'><p>Last Move: " + history + "</p></div>");
}

function createCurrentScoreElement(currentScore){
	var currentScoreContainer = $('.current-score');
	currentScoreContainer.empty();
	currentScoreContainer.text(currentScore);
}

function clickHandler() {	
	var element = $(this);
	
	if(moveOperation && element.hasClass('operation-tile')){
		reset();	
	}
	if(moveNumberTiles.length === 2 && element.hasClass('number-tile')){
		reset();
	}
	
	element.toggleClass("selected");
	
	preMove(element.data("value"), element);
}

function preMove (value, $element){
	if(isNaN(value)){
		moveOperation = value;
	}
	else{
		moveNumberTiles.push({
			value: value,
			element: $element
		});
	}
	
	if(moveOperation && moveNumberTiles.length === 2){
		performMove();
	}
}

function performMove () {
	var result = OperationTiles[moveOperation](moveNumberTiles[0].value, moveNumberTiles[1].value);
	
	var $numContainer = $('.numbers-container');
	var $newNumberTile = createNumberTile(result);
	$numContainer.prepend($newNumberTile);
	
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
	$element.children('color', '#EEE4DA');
	
	setTimeout(function(){
		updateScore()
		publishHistory();
		solveCounter();
		newPuzzle();
	}, 300);
}

function incorrect($element){
	$element.addClass('incorrect');
}

function publishHistory(){
	var history = "";
	var $roundSolves = $('.round-solves-container');
	
	for(var i=0, len=currentPuzzleMoves.length;i<len;i++){
		history += " (" + currentPuzzleMoves[i].historyString + ") ";
	}
	
	$roundSolves.prepend(createHistoryElement(history));
	currentPuzzleMoves=[];
}

function updateScore(){
	currentScore++;
	createCurrentScoreElement(currentScore);
}

function skipPuzzle(){
	skipCounter();
	newPuzzle();
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
	setTimer();
	setScores();
	setOperations();
}

function startNewGame () {
	$(".numbers-container").on("click", ".number-tile", clickHandler);
	$(".operations-container").on("click", ".operation-tile", clickHandler);
	
	clearRoundHistory();
	setNewGame();
	setTileNumbers();
	startTimer();
}

function lostGame () {
	$(".numbers-container").off("click", ".number-tile", clickHandler);
	$(".operations-container").off("click", ".operation-tile", clickHandler);
}

function clearRoundHistory (){
	var $roundSolves = $('.round-solves-container');
	$roundSolves.empty();
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
};

function setScores (){
	var currentScore = 0;
	var bestScore = 0;
	
	var currentScoreContainer = $('.current-score');
	var bestScoreContainer = $('.best-score');
	
	currentScoreContainer.text(currentScore);
	bestScoreContainer.text(bestScore);
}

function emptyBeforeNewPuzzle(){
	reset();
	var $numContainer = $('.numbers-container');
	var $currentPuzzleHistoryContainer = $('.current-puzzle-history-container');
	
	$numContainer.empty();
	$currentPuzzleHistoryContainer.empty();
	
	currentPuzzleMoves = [];
}

function setTiles (array) {
	emptyBeforeNewPuzzle();
	var $numContainer = $('.numbers-container');
	
	for(var i=0; i < array.length; i++) {
		var $newNumberTile = createNumberTile(array[i]);
		$numContainer.append($newNumberTile);
	}
}

function setOperations () {
	var $operationContainer = $('.operations-container');
	$operationContainer.empty();
	for(var op in OperationTiles){
		var $newOpTile = createOperationTile(op);
		$operationContainer.append($newOpTile);
	}
}

var moveOperation = null;
var moveNumberTiles = [];

var currentPuzzleMoves = [];
var currentRoundSolves = [];

var currentScore = 0;
var bestScore = 0;

var OperationTiles = {
	'+':function(a,b){return a+b},
	'-':function(a,b){return a-b},
	'x':function(a,b){return a*b},
	'/':function(a,b){return a/b}
};

$(window).load(function(){
	setTiles([""]);
	setNewGame();
	
	ref.child('solutions').on("value", function(snapshot){
		allSolutions = snapshot.val();
		init();
	});
});