var ref = new Firebase("https://twentyfour-game.firebaseio.com/");

ref.child("solutions").on("value", function (snapshot) {
	solutions = snapshot.val();
	init();
});

function init() {
	var ids = Object.keys(solutions);
	puzzle = ids[Math.random() * ids.length];
	puzzleSolution = puzzle[Object.keys(puzzle)[0]].solution;
	console.log(puzzleSolution);
	
	// Object.keys(solutions) === array of all puzzles' id
	// puzzle = keys[randomIndex]
	// solution = puzzle[Object.keys(puzzle)[0]].solution
		
}
