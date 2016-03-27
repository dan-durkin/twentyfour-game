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
		var element = this;
		animateTile.call(element.parentElement, ['bounceOutRight']);
	}

	function animateWrong(){
		var element = this;
		animateTile.call(element.parentElement, ['shake']);
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
