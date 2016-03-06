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

function getHotKey (key){
	var hotKeys = {
		'+':{keycode: 81, shortcut: 'q'}, 
		'-':{keycode: 87, shortcut: 'w'}, 
		'x':{keycode: 69, shortcut: 'e'},
		'/':{keycode: 82, shortcut: 'r'},
		'49':{keycode:49, index: 0},
		'50':{keycode:50, index: 1},
		'51':{keycode:51, index: 2},
		'52':{keycode:52, index: 3},
	}
	
	return hotKeys[key];
}

function toggleHotKeys (){
	$('.hot-key').toggleClass('show');
	$('.undo').toggleClass('hot');
	$('.skip').toggleClass('hot');
}

function hotKeysOff (){
	$('.hot-key').removeClass('show');
	$('.undo').removeClass('hot');
	$('.skip').removeClass('hot');
}

function hotKeysOn (){
	$('.hot-key').addClass('show');
	$('.undo').addClass('hot');
	$('.skip').addClass('hot');
}

function checkHotKeys (){
	return $('.hot-key').hasClass('show');
}

function setNumberHotKeys(){
	$('.hot-key.number-tile').empty();
	
	$('.number-tile').each(function (num, element){
		$(this).children('.hot-key').text(num + 1);
	});
}

function keyHandler (event){	
	//event.preventDefault();
	
	switch(event.which){
		case 32:
			toggleHotKeys();
			break;
		// Purposely fallling through
		case 81:
		case 87:
		case 69:
		case 82:
			clickHandler.call(document.querySelector('[data-operation="' + event.which + '"]'));
			break;
		case 49:
		case 50:
		case 51:
		case 52:
			clickHandler.call(document.querySelectorAll(".number-tile")[getHotKey(event.which).index]);
			break;
		case 37:
			undoMove();
			break;
		case 39:
			skipPuzzle();
			break;
		default:
			break;
	}
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
	var result = OperationTiles[moveOperation](moveNumberTiles[0].value, moveNumberTiles[1].value);
	
	var $numContainer = $('.numbers-container');
	var $newNumberTile = createNumberTile(result);
	
	$numContainer.prepend($newNumberTile);
	
	if(checkHotKeys()){
		$('.hot-key').addClass('show')
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
	lostGame();
	$(".numbers-container").on("click", ".number-tile", clickHandler);
	$(".operations-container").on("click", ".operation-tile", clickHandler);
	$(window).keydown(keyHandler);
	$('.hint').addClass('show');
	
	clearRoundHistory();
	setNewGame();
	setTileNumbers();
	startTimer();
}

function lostGame () {
	reset();
	$(".numbers-container").off("click", ".number-tile", clickHandler);
	$(".operations-container").off("click", ".operation-tile", clickHandler);
	$(window).off("keydown", keyHandler);
	$('.hint').removeClass('show');
	hotKeysOff();
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
	setNumberHotKeys();
	
	if(checkHotKeys()){
		hotKeysOn();
	}
	else{
		hotKeysOff();
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