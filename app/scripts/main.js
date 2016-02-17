function createNumberTile (data){
	var template =  "<div class='flex-child number-tile tile'><div class='number-content content'><div><span class='number'>" + data + "</span></div></div></div>";
	
	return createTile(template, data);
}
	
function createOperationTile (op) {
	var template = "<div class='flex-child operation-tile tile'><div class='operation-content content'><div><span class='number'>" + op + "</span></div></div></div>";
	
	return createTile(template, op);
}

function createTile (template, value) {
	var $tile = $(template);
	
	var clickHandler = function () {
		$(this).toggleClass("selected");
		preMove(value);
	}
	
	$tile.click(clickHandler);
	
	return $tile;
}

function preMove (value){
	if(isNaN(value)){
		moveOperation = value;
	}
	else{
		moveNumberTiles.push(value);
	}
	
	if(moveOperation && moveNumberTiles.length === 2){
		performMove();
	}
}

function performMove () {
	result = OperationTiles[moveOperation](moveNumberTiles[0], moveNumberTiles[1]);

	var $numContainer = $('.numbers-container');
	var numberTileObj = new NumberTile(result);
	var $newNumberTile = createNumberTile(numberTileObj.value);
	$numContainer.prepend($newNumberTile);

	var moveStore = [moveNumberTiles[0], moveOperation, moveNumberTiles[1], $newNumberTile]
	currentPuzzleMoves.push(moveStore);

	var selectedTiles = $('.selected.number-tile');
	selectedTiles.remove();
	reset();
}

function undoMove () {
	reset();
	
	if(currentPuzzleMoves.length > 0){
		var lastMove = currentPuzzleMoves.pop();
		console.log(lastMove, currentPuzzleMoves);
		var $numContainer = $('.numbers-container');
		
		for(var i =0, len = lastMove.length; i<len;i++){
			if(!isNaN(lastMove[i]) && !(lastMove[i] instanceof jQuery)){
				var numberTileObj = new NumberTile(lastMove[i]);
				var $newNumberTile = createNumberTile(numberTileObj.value);
				$numContainer.prepend($newNumberTile);
			}
			else if(lastMove[i] instanceof jQuery){
				lastMove[i].remove();
			}
		}
	}
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
	$operationContainer.empty

	for(var i=0; i < num; i++) {
		var numberTileObj = new NumberTile(6);
		var $newNumberTile = createNumberTile(numberTileObj.value);
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

function NumberTile (value){
	this.value = value;
}

$(window).load(function(){
	setTiles(4);
});