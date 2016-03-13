TwentyFour.score = (function () {
	/***
	Public Methods
	***/
	
	function updateCurrentScore(){
		var currentScoreContainer = $('.current-score');
		var currentScore = parseInt(currentScoreContainer.text());
		var newScore = currentScore + 1;
		currentScoreContainer.text(newScore);
	}
	
	return {
		updateCurrentScore:updateCurrentScore	
	};
})();