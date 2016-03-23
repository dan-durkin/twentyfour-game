(function(){
	window.onload = function(){
		TwentyFour.login.config();
		TwentyFour.display.setupBoard();


		document.querySelector(".game-container").addEventListener("click", function (event) {
			if (event.target.className === "number-tile" || event.target.className === "hotkey show" || event.target.className === "operation-tile") {
				TwentyFour.play.selectTile.call(event.target);
			}
		});
/*
		document.querySelector(".operations-container").addEventListener("click", function (event) {
			if (event.target.className === "operation-tile" || event.target.className === "hotkey show") {
				TwentyFour.play.selectTile(event.target);
			}
		});*/

		document.querySelector('.login-btn').addEventListener("click", TwentyFour.login.facebookLogin);
		document.querySelector('.logout-btn').addEventListener("click", TwentyFour.login.logout);
		document.querySelector('.undo-tile').addEventListener("click", TwentyFour.play.undoMove);
		document.querySelector('.skip-tile').addEventListener("click", TwentyFour.play.skipPuzzle);
		document.addEventListener("keydown", TwentyFour.hotkeys.keyHandler);

		ref = TwentyFour.data.getRef();
		ref.child('solutions').on("value", function(snapshot){
			TwentyFour.data.setSolutions(snapshot.val());
			TwentyFour.data.init();
		});

		TwentyFour.display.ready();
	};
})();
