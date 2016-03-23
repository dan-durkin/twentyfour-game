(function(){
	window.onload = function(){
		TwentyFour.login.config();
		TwentyFour.display.setupBoard();

		ref = TwentyFour.data.getRef();
		ref.child('solutions').on("value", function(snapshot){
			TwentyFour.data.setSolutions(snapshot.val());
			TwentyFour.data.init();
		});

		TwentyFour.display.ready();
	};
})();
