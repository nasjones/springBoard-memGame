const gameContainer = document.getElementById("game");
const startButton = document.getElementById("start");
const scoreBoard = document.getElementById("score");
const hiScore = document.getElementById("hiscore");
const cardNum = document.getElementById("cardNumber");
let currentFlipped = 0;
let score = 0;
hiscore.innerText = localStorage.hiscore;

for (let i = 4; i <= 100; i += 2) {
	cardNum.innerHTML += `<option value="${i}">${i}</option>`;
}

function colorPicker() {
	let colorStrings = [];
	for (let i = cardNum.value / 2; i > 0; i -= 1) {
		let col = [];
		for (var j = 0; j < 3; j++) col.push(Math.floor(Math.random() * 255));
		colorStrings.push(`rgb(${col[0]},${col[1]},${col[2]})`);
	}
	return colorStrings.concat(colorStrings);
}
// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle() {
	let array = colorPicker();
	let counter = array.length;

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		let index = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter--;

		// And swap the last element with it
		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
	for (let color of colorArray) {
		// create a new div
		const newDiv = document.createElement("div");

		// give it a class attribute for the value we are looping over
		newDiv.classList.add(color);

		// call a function handleCardClick when a div is clicked on
		newDiv.addEventListener("click", handleCardClick);

		// append the div to the element with an id of game
		gameContainer.append(newDiv);
	}
}

// TODO: Implement this function!
function handleCardClick(event) {
	// you can use event.target to see which element was clicked
	let card = event.target;
	if (card.classList.contains("flipped") || card.classList.contains("done")) {
		return;
	} else if (currentFlipped < 2) {
		card.classList.add("flipped");
		card.style.backgroundColor = card.classList[0];
		score += 1;
		scoreBoard.innerText = score;
		currentFlipped += 1;
		matchCheck();
	}

	if (document.getElementsByClassName("done").length == cardNum.value) {
		if (localStorage.hiscore) {
			localStorage.hiscore =
				score < localStorage.hiscore ? score : localStorage.hiscore;
		} else {
			localStorage.hiscore = score;
		}
		hiscore.innerText = localStorage.hiscore;
	}
}

function matchCheck() {
	if (currentFlipped == 2) {
		let flipped = document.getElementsByClassName("flipped");
		if (flipped[0].classList[0] == flipped[1].classList[0]) {
			while (flipped.length > 0) {
				flipped[0].classList.toggle("done");
				flipped[0].classList.toggle("flipped");
			}
			currentFlipped = 0;
		} else {
			setTimeout(() => {
				while (flipped.length > 0) {
					flipped[0].style.backgroundColor = "white";
					flipped[0].classList.toggle("flipped");
				}
				currentFlipped = 0;
			}, 1000);
		}
	}
}

// when the DOM loads
startButton.addEventListener("click", (e) => {
	gameContainer.innerHTML = "";
	let shuffledColors = shuffle();
	createDivsForColors(shuffledColors);
	score = 0;
	currentFlipped = 0;
	scoreBoard.innerText = score;
});
