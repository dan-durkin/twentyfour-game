TwentyFour.data = (function(){
	/***
	Private variables
	***/
	
	var ref = new Firebase("https://twentyfour-game.firebaseio.com/");
	var refSolutions = ref.child("solutions");
	
	var allSolutions = null;
	var thisPuzzleID = null;
	var currentPuzzleData = null;
	var currentPuzzleNumbers = null;

	/***
	Public Methods
	***/
	
	function getRef(){
		return ref;
	}
	
	function setSolutions (data){
		allSolutions = data;
		return allSolutions;
	}

	function init() {	
		var ids = Object.keys(allSolutions);
		thisPuzzleID = ids[Math.ceil(Math.random() * ids.length)];
		currentPuzzleData = allSolutions[thisPuzzleID];
		currentPuzzleNumbers = currentPuzzleData.solution;
	}

	var solveCounter = function (){
		var res = parseInt(currentPuzzleData.solves) + 1;
		refSolutions.child(thisPuzzleID).update({"solves": res});
	}

	var skipCounter = function (){
		var res = parseInt(currentPuzzleData.skips) + 1;
		refSolutions.child(thisPuzzleID).update({"skips": res});
	}

	var viewCounter = function (){
		var res = parseInt(currentPuzzleData.views) + 1;
		refSolutions.child(thisPuzzleID).update({"views": res});
	}
	
	function getNumbersData (){
		return currentPuzzleNumbers;
	}
	
	function getOperations(){
		var OperationTiles = {
			'+':function(a,b){return a+b},
			'-':function(a,b){return a-b},
			'x':function(a,b){return a*b},
			'/':function(a,b){return a/b}
		};

		return OperationTiles;
	}
	
	return {
		getRef: getRef,
		setSolutions: setSolutions,
		init: init,
		solveCounter:solveCounter,
		skipCounter:skipCounter,
		viewCounter:viewCounter,
		getNumbersData:getNumbersData,
		getOperations:getOperations
	};
})();