TwentyFour.setup = (function(){
	$(window).load(function(){
		$(".numbers-container").on("click",".number-tile", TwentyFour.play.selectTile);
		$(".operations-container").on("click",".operation-tile", TwentyFour.play.selectTile);
		$(window).on("keydown",TwentyFour.hotkeys.keyHandler);
		
		TwentyFour.display.setupBoard();
		
		ref = TwentyFour.data.getRef();
		ref.child('solutions').on("value", function(snapshot){
			TwentyFour.data.setSolutions(snapshot.val()); 
			TwentyFour.data.init();
		});
		
		TwentyFour.display.ready();
	});
})();