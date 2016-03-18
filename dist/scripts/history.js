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
		var $roundSolves = $('.round-solves-container');

		for(var i=0, len=currentPuzzleMoves.length;i<len;i++){
			history += " (" + currentPuzzleMoves[i].historyString + ") ";
		}

		$roundSolves.prepend(TwentyFour.display.createHistoryElement(history));
		emptyCurrentHistory();
	}
	
	function clearRoundHistory (){
		var $roundSolves = $('.round-solves-container');
		$roundSolves.empty();
		currentRoundSolves = [];
	}
	
	function updateCurrentHistory (moveStore){
		currentPuzzleMoves.push(moveStore);
		
		var $historyContainer = $('.current-puzzle-history-container');
		$historyContainer.prepend(moveStore.historyElement)
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