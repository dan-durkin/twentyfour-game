TwentyFour.history = (function () {
	/***
	Private Variables
	***/

	var currentPuzzleMoves = [];
	var currentRoundSolves = [];

	/***
	Public Methods
	***/

	function publishHistory(){
		var history = "";
		var roundSolves = document.querySelector('.round-solves-container');

		for(var i=0, len=currentPuzzleMoves.length;i<len;i++){
			history += " (" + currentPuzzleMoves[i].historyString + ") ";
		}

		roundSolves.innerHTML += TwentyFour.display.createHistoryElement(history);
		emptyCurrentHistory();
	}

	function clearRoundHistory (){
		document.querySelector('.round-solves-container').innerHTML = "";
		currentRoundSolves = [];
	}

	function updateCurrentHistory (moveStore){
		currentPuzzleMoves.push(moveStore);
		document.querySelector('.current-puzzle-history-container').innerHTML += moveStore.historyElement;
	}

	function emptyCurrentHistory(){
		currentPuzzleMoves = [];
	}

	function getCurrentHistory(){
		return currentPuzzleMoves;
	}

	return {
		publishHistory:publishHistory,
		clearRoundHistory:clearRoundHistory,
		emptyCurrentHistory:emptyCurrentHistory,
		getCurrentHistory:getCurrentHistory,
		updateCurrentHistory:updateCurrentHistory
	}
})();
