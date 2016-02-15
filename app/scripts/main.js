var ops = ['+','-','x','/'];

function createNumberTile (data){
	var template = "<div class='flex-child number-tile tile'><div class='number-content content'><div><span class='number'>" + data + "</span></div></div></div>";
	
	var $num = $(template);
	
	var clickHandler = function () {
		$(this).toggleClass("selected");
	}
	
	$num.click(clickHandler);
	
	return $num;
}

function createOperationTile (op) {
	var template = "<div class='flex-child operation-tile tile'><div class='operation-content content'><div><span class='number'>" + op + "</span></div></div></div>";
	
	var $op = $(template);
	
	var clickHandler = function () {
		$(this).toggleClass("selected");
	}
	
	$op.click(clickHandler);
	
	return $op;
}

var setNumberTiles = function (num, ops) {
	var $numContainer = $('.numbers-container');
	var $operationContainer = $('.operations-container');
	$numContainer.empty();
	$operationContainer.empty

	for (var i = 0; i < num; i++) {
		var $newNumberTile = createNumberTile(6);
		$numContainer.append($newNumberTile);
	}
	for(var i=0, len=ops.length;i<len;i++){
		var $newOpTile = createOperationTile(ops[i]);
		$operationContainer.append($newOpTile);
	}
};

$(window).load(function(){
	setNumberTiles(4, ops);
});