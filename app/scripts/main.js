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
		performMove(value);
	}
	
	$tile.click(clickHandler);
	
	return $tile;
}

function performMove (value) {
	if(isNaN(value)){
		moveOperation = value;
	}
	else{
		moveNumberTiles.push(value);
	}
	
	if(moveOperation && moveNumberTiles.length === 2){
		result = OperationTiles[moveOperation](moveNumberTiles[0], moveNumberTiles[1]);
		var selectedTiles = $('.selected.number-tile');
		var selectedOperation = $('.selected.operation-tile');
		selectedTiles.remove();
		selectedOperation.removeClass("selected");
		
		var $numContainer = $('.numbers-container');
		var numberTileObj = new NumberTile(result);
		var $newNumberTile = createNumberTile(numberTileObj.value);
		$numContainer.prepend($newNumberTile);
		
		var moveStr = moveNumberTiles[0].toString() + ' ' + moveOperation + ' '+ moveNumberTiles[1].toString();
		currentPuzzleMoves.push(moveStr);
		
		moveOperation = null;
		moveNumberTiles = [];
	}
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

$(window).load(function(){
	setTiles(4);
});