TwentyFour.animate = (function (){
	/***
	Private Methods
	***/
	function animateTile (animationName) {
		function newClassString () {
			var str = ""
			for(var i = 0, len = this.classList.length; i<len; i++){
				str += ' ' + this.classList[i] + ' ';
			}
			return str + ' animated ' + animationName;
		}

		var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

		this.setAttribute('class', newClassString.call(this));

		/***
		THIS ISN'T WORKING
		***/

		setTimeout(function(){
			this.classList.remove(["animated", animationName]);
		}, 100);
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

	function animateNewElement (newElement){
		animateTile.call(newElement, ['flipInX']);
	}

	function animateOut (oldElement){
		animateTile.call(oldElement, ['flipOutX']);
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

	return {
		animateNewGame:animateNewGame,
		animateNewElement:animateNewElement,
		animateOut:animateOut,
		animateNewPuzzle:animateNewPuzzle,
		animateRight:animateRight,
		animateWrong:animateWrong
	};
})();
