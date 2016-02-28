function setTimer(){
	var timer = $('.time-left');
	timer.empty();
	timer.append(":60");
}

function updateTime(){
	var count = 3000;
	var counter = setInterval(timer, 10); 

	function timer()
	{
		if (count <= 0)
		{
			clearInterval(counter);
			return;
		}
			count--;
			document.getElementById("timer").innerHTML=count /100+ " secs"; 
	}
}