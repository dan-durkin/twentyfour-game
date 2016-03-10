TwentyFour.timer = (function () {
	var timeLeft = 60000;
	var interval = 1000;
	var timer;
	
	function setTimer(){
		timeLeft = 60000;
		interval = 1000;
		var timeLeftNode = document.querySelector(".time-left");
		timeLeftNode.textContent = formatTimeLeft();
	}
	
	function formatTimeLeft() {
		var seconds = timeLeft / 1000;

		if (timeLeft > 10000) {
			return seconds;
		}else{
			return timeLeft % 1000 === 0 && timeLeft !== 0 ? seconds + ".0" : seconds;
		}
	}

	function startTimer(){
		var timeLeftNode = document.querySelector(".time-left");
		clearInterval(timer);

		function tick() {
			timeLeft -= interval;

			// update the display
			timeLeftNode.textContent = formatTimeLeft();

			// check to see if time is up
			if (timeLeft <= 0) {
				alert("you lose");
				clearInterval(timer);
				TwentyFour.display.lostGame();
			} else if (timeLeft <= 10000 && interval > 100) {
				clearInterval(timer);
				interval = 100;
				timer = setInterval(tick, interval);
			}
		}

		timer = setInterval(tick, interval);
	}

	return {
		setTimer: setTimer,
		startTimer: startTimer
	};
}());