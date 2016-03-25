TwentyFour.animate = (function (){
	/***
	Private Methods
	***/

	function animateTile (animationName) {
		var element = this;
		element.classList.add("animated",animationName);
	}

	/***
	Public Methods
	***/
	function animateNewGame (){
		var puzzleTiles = document.querySelectorAll('.number-tile-container');
		for(var i =0, len = puzzleTiles.length; i<len;i++){
			animateTile.call(puzzleTiles.item(i), ['zoomIn']);
		}
	}

	function animateNewElement (){
		var element = this;
		animateTile.call(element, ['flipInX']);
	}

	function animateOut (){
		var element = this;
		animateTile.call(element, ['flipOutX']);
	}

	function animateNewPuzzle(){
		var puzzleTiles = document.querySelectorAll('.number-tile-container');
		for(var i =0, len = puzzleTiles.length; i<len;i++){
			animateTile.call(puzzleTiles.item(i), ['bounceIn']);
		}
	}

	function animateRight(){
		var correct = document.querySelector('.number-tile-container.correct');
		animateTile.call(correct, ['bounceOutRight']);
	}

	function animateWrong(){
		var wrong = document.querySelector('.number-tile-container.correct');
		animateTile.call(wrong, ['shake']);
	}

	function removeAnimation () {
		var element = this;
		element.classList.remove("animated", "zoomIn", "flipInX", "flipOutX", "bounceIn", "bounceOutRight", "shake");
	}

	return {
		animateNewGame:animateNewGame,
		animateNewElement:animateNewElement,
		animateOut:animateOut,
		animateNewPuzzle:animateNewPuzzle,
		animateRight:animateRight,
		animateWrong:animateWrong,
		removeAnimation:removeAnimation
	};
})();
