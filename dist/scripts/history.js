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
	
	return {
		publishHistory:publishHistory
	}
})();