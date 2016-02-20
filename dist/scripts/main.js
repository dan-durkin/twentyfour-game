function createNumberTile (data){
	return $("<div class='flex-child number-tile tile' data-value='" + data + "'><div class='number-content content'><div><span class='number'>" + data + "</span></div></div></div>");
}
	
function createOperationTile (op) {
	return $("<div class='flex-child operation-tile tile' data-value='" + op + "'><div class='operation-content content'><div><span class='number'>" + op + "</span></div></div></div>");
}

function clickHandler() {
	var element = $(this);
	element.toggleClass("selected");
	preMove(element.data("value"), element);
}

$(".numbers-container").on("click", ".number-tile", clickHandler);
$(".operations-container").on("click", ".operation-tile", clickHandler);

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
	result = OperationTiles[moveOperation](moveNumberTiles[0].value, moveNumberTiles[1].value);

	var $numContainer = $('.numbers-container');
	var $newNumberTile = createNumberTile(result);
	$numContainer.prepend($newNumberTile);

	var moveStore = {
		firstNumber: moveNumberTiles[0].value,
		secondNumber: moveNumberTiles[1].value,
		moveOperation: moveOperation,
		firstNumberElement: moveNumberTiles[0].element,
		secondNumberElement: moveNumberTiles[1].element,
		newElement: $newNumberTile,
	};
	
	currentPuzzleMoves.push(moveStore);

	var selectedTiles = $('.selected.number-tile');
	selectedTiles.remove();
	reset();
}

function undoMove () {	
	if(currentPuzzleMoves.length > 0){
		var lastMove = currentPuzzleMoves.pop();
		lastMove.newElement.remove();
		var $numContainer = $('.numbers-container');
		$numContainer.prepend(lastMove.secondNumberElement);
		$numContainer.prepend(lastMove.firstNumberElement);
	}
	
	reset();
}

function reset () {
	var selected =$('.selected');
	selected.removeClass('selected');
	moveOperation = null;
	moveNumberTiles = [];
}

var setTiles = function (num) {
	var $numContainer = $('.numbers-container');
	var $operationContainer = $('.operations-container');
	$numContainer.empty();
	$operationContainer.empty();

	for(var i=0; i < num; i++) {
		var $newNumberTile = createNumberTile(6);
		$numContainer.append($newNumberTile);
	}
	for(var op in OperationTiles){
		var $newOpTile = createOperationTile(op);
		$operationContainer.append($newOpTile);
	}
};

var moveOperation = null;
var moveNumberTiles = [];
var currentPuzzleMoves = [];
var currentRoundSolves = [];

var OperationTiles = {
	'+':function(a,b){return a+b},
	'-':function(a,b){return Math.abs(a-b)},
	'x':function(a,b){return a*b},
	'/':function(a,b){return a/b}
};

$(window).load(function(){
	setTiles(4);
});