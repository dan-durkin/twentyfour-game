TwentyFour.score = (function () {
	/***
	Public Methods
	***/

	function updateCurrentScore(){
		var currentScoreContainer = document.querySelector('.current-score');
		var currentScore = parseInt(currentScoreContainer.textContent);
		var newScore = currentScore + 1;
		currentScoreContainer.textContent = newScore;
	}

	return {
		updateCurrentScore:updateCurrentScore
	};
})();
