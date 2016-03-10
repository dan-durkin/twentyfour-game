TwentyFour.setup = (function(){
	$(window).load(function(){
		setTiles(["","","",""]);
		setNewGame();

		ref = TwentyFour.data.getRef();
		ref.child('solutions').on("value", function(snapshot){
			TwentyFour.data.setSolution(snapshot.val()); 
			init();
		});
	});
	
	return {
		
	};
})();



function startNewGame () {
	lostGame();
	$(".numbers-container").on("click", ".number-tile", clickHandler);
	$(".operations-container").on("click", ".operation-tile", clickHandler);
	$(window).keydown(keyHandler);
	
	clearRoundHistory();
	setNewGame();
	setTileNumbers();
	TwentyFour.timer.startTimer();
}

function lostGame () {
	reset();
	$(".numbers-container").off("click", ".number-tile", clickHandler);
	$(".operations-container").off("click", ".operation-tile", clickHandler);
	$(window).off("keydown", keyHandler);
	$('.hint').removeClass('show');
	hotKeysOff();
}