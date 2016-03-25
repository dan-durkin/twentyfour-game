(function(){
	window.onload = function(){
		TwentyFour.login.config();
		TwentyFour.display.setupBoard();

		document.querySelector(".game-container").addEventListener("click", function (event) {
			if (event.target.classList.contains("number-tile") || event.target.classList.contains("hotkey") || event.target.classList.contains("operation-tile")){
				TwentyFour.play.selectTile.call(event.target);
			}
			else if (event.target.classList.contains("login-btn")){
				TwentyFour.login.facebookLogin.call(event.target);
			}
			else if (event.target.classList.contains("logout-btn")){
				TwentyFour.login.logout.call(event.target);
			}
			else if (event.target.classList.contains("undo-tile")){
				TwentyFour.play.undoMove.call(event.target);
			}
			else if (event.target.classList.contains("skip-tile")){
				TwentyFour.play.skipPuzzle.call(event.target);
			}
		});
		document.addEventListener("keydown", TwentyFour.hotkeys.keyHandler);

		document.addEventListener("animationend", function(event){
			TwentyFour.animate.removeAnimation.call(event.target);
		}, false);
		document.addEventListener("webkitAnimationEnd", function(event){
			TwentyFour.animate.removeAnimation.call(event.target);
		}, false);
		document.addEventListener("mozAnimationEnd", function(event){
			TwentyFour.animate.removeAnimation.call(event.target);
		}, false);
		document.addEventListener("MSAnimationEnd", function(event){
			TwentyFour.animate.removeAnimation.call(event.target);
		}, false);

		ref = TwentyFour.data.getRef();
		ref.child('solutions').on("value", function(snapshot){
			TwentyFour.data.setSolutions(snapshot.val());
			TwentyFour.data.init();
		});

		TwentyFour.display.ready();
	};
})();
