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