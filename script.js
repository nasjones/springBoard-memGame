const gameContainer = document.getElementById("game");
const startButton = document.getElementById("start");
const scoreBoard = document.getElementById("score");
const scoreTable = document.getElementById("hiscores");
const cardNum = document.getElementById("cardNumber");
const over = document.getElementById("over");
let currentFlipped = 0;
let score = 0;

if (!localStorage.hiscores) {
	let scores = {};
	for (let i = 4; i <= 50; i += 2) {
		scores[`${i}`] = 0;
	}
	localStorage.setItem("hiscores", JSON.stringify(scores));
	scoreDisplay();
} else {
	scoreDisplay();
}

for (let i = 4; i <= 50; i += 2) {
	let opt = document.createElement("option");
	opt.value = i;
	opt.innerText = `${i}`;
	cardNum.appendChild(opt);
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

	endGame();
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

function endGame() {
	if (document.getElementsByClassName("done").length == cardNum.value) {
		let tempscores = JSON.parse(localStorage.getItem("hiscores"));
		over.classList.remove("hide");
		if (
			tempscores[cardNum.value] == 0 ||
			tempscores[cardNum.value] > score
		) {
			tempscores[cardNum.value] = score;
			localStorage.setItem("hiscores", JSON.stringify(tempscores));
			scoreDisplay();
		}
	}
}

function scoreDisplay() {
	scoreTable.children[2].innerHTML = "";
	let scoreHold = JSON.parse(localStorage.getItem("hiscores"));
	let i = 0;
	for (let [key, value] of Object.entries(scoreHold)) {
		let row = scoreTable.children[2].insertRow();
		let cell = row.insertCell();
		cell.innerText = `${key}`;
		cell = row.insertCell();
		cell.innerText = `${value}`;
		i++;
	}
}

function gameStart() {
	gameContainer.innerHTML = "";
	over.classList.add("hide");
	let shuffledColors = shuffle();
	createDivsForColors(shuffledColors);
	score = 0;
	currentFlipped = 0;
	scoreBoard.innerText = score;
}

startButton.addEventListener("click", gameStart);
cardNum.addEventListener("change", gameStart);
