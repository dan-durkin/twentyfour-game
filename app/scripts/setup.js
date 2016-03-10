TwentyFour.setup = (function(){
	$(window).load(function(){
		TwentyFour.display.setNewGame();

		ref = TwentyFour.data.getRef();
		ref.child('solutions').on("value", function(snapshot){
			TwentyFour.data.setSolutions(snapshot.val()); 
			TwentyFour.data.init();
		});
	});
})();