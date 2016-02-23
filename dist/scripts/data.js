var ref = new Firebase("https://twentyfour-game.firebaseio.com/");
var allSolutions = null;

var thisPuzzleID = null;
var currentPuzzleData = null;
var currentPuzzleNumbers = null;
var latestSnapShot = null;

function init() {	
	var ids = Object.keys(allSolutions);
	thisPuzzleID = ids[Math.ceil(Math.random() * ids.length)];
	currentPuzzleData = allSolutions[thisPuzzleID];
	currentPuzzleNumbers = currentPuzzleData.solution;
}

var solveCounter = function (){
	var refSolutions = ref.child("solutions");
	var res = parseInt(currentPuzzleData.solves) + 1;
	refSolutions.child(thisPuzzleID).update({"solves": res});
}

var skipCounter = function (){
	var refSolutions = ref.child("solutions");
	var res = parseInt(currentPuzzleData.skips) + 1;
	refSolutions.child(thisPuzzleID).update({"skips": res});
}

var viewCounter = function (){
	var refSolutions = ref.child("solutions");
	var res = parseInt(currentPuzzleData.views) + 1;
	refSolutions.child(thisPuzzleID).update({"views": res});
}