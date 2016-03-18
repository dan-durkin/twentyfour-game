TwentyFour.timer = (function () {
	/***
	Private Variables
	***/

	var timeLeft = 90000;
	var interval = 100;
	var timer;

	/***
	Private Methods
	***/

	function formatTimeLeft() {
		var seconds = timeLeft / 1000;
		return timeLeft % 1000 === 0 && timeLeft !== 0 ? seconds + ".0" : seconds;
	}

	/***
	Public Methods
	***/

	function setTimer(){
		timeLeft = 90000;
		interval = 100;
		var timeLeftNode = document.querySelector(".time-left");
		timeLeftNode.textContent = formatTimeLeft();
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
				TwentyFour.play.endOfRound();
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
