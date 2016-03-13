TwentyFour.history = (function () {
	var currentPuzzleMoves = [];
	var currentRoundSolves = [];
	
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
	
	function updateCurrentHistory (data){
		currentPuzzleMoves.push(data);
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