TwentyFour.animate = (function (){
	/***
	Private Methods
	***/
	function animateTile (animationName) {
		var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		$(this).addClass('animated ' + animationName).one(animationEnd, function() {
			$(this).removeClass('animated ' + animationName);
		});
	}

	/***
	Public Methods
	***/
	function animateNewGame (){
		var puzzleTiles = $('.number-tile');
		animateTile.call(puzzleTiles, ['zoomIn']);
	}

	function animateNewElement ($newElement){
		animateTile.call($newElement, ['flipInX']);
	}

	function animateOut ($oldElement){
		animateTile.call($oldElement, ['flipOutX']);
	}

	function animateNewPuzzle(){
		var puzzleTiles = $('.number-tile');
		animateTile.call(puzzleTiles, ['bounceIn']);
	}

	function animateRight(){
		var correct = $('.number-tile.correct');
		animateTile.call(correct, ['bounceOutRight']);
	}
	function animateWrong(){
		var wrong = $('.number-tile.incorrect');
		animateTile.call(wrong, ['shake']);
	}

	return {
		animateNewGame:animateNewGame,
		animateNewElement:animateNewElement,
		animateOut:animateOut,
		animateNewPuzzle:animateNewPuzzle,
		animateRight:animateRight,
		animateWrong:animateWrong
	};
})();
