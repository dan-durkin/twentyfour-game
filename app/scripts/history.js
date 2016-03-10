TwentyFour.history = (function () {
	function publishHistory(){
		var history = "";
		var $roundSolves = $('.round-solves-container');

		for(var i=0, len=currentPuzzleMoves.length;i<len;i++){
			history += " (" + currentPuzzleMoves[i].historyString + ") ";
		}

		$roundSolves.prepend(createHistoryElement(history));
		currentPuzzleMoves=[];
	}
	
	function clearRoundHistory (){
		var $roundSolves = $('.round-solves-container');
		$roundSolves.empty();
	}
	
	return {
		publishHistory:publishHistory,
		clearRoundHistory:clearRoundHistory
	}
})();