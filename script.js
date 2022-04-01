var selectorColor = 0; // 0 = none, 1 = green, 2 = yellow

const table = document.getElementById("table");
const greenButton = document.getElementById("greenButton");
const yellowButton = document.getElementById("yellowButton");
const tempButton = document.getElementById("temp");

const tableContainer = document.getElementById("tableContainer");
const buttonContainer = document.getElementById("buttonContainer");

const parentDiv = document.getElementsByClassName("parent")[0];

const none = "#e9e9ed";
const green = "#99cc00";
const yellow = "#dddd00";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const gapLength = 10;

var size = 0;

var board = []; // stores the state of the game
var currentRow = 0; // the current row which the computer is processing

var words = []; // all the words that are still valid
var index = []; // how common every letter is

var letterData = []; // where each letter can be

function init() {
	size = document.body.clientWidth / 17;
	for (let i = 0; i < 6; i++) {
		let row = [];
		for (let j = 0; j < 5; j++)
			row.push(new Cell("", 0));
		board.push(row);
	}
	for (let i = 0; i < allWords.length; i++)
		words.push(allWords[i]);

	for (let i = 0; i < 26; i++)
        index.push([letters.charAt(i), 0]);
    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        for (let j = 0; j < word.length; j++)
            index[letters.indexOf(word.charAt(j))][1]++;
    }
    index.sort((o1, o2) => o2[1]-o1[1]);

	for (let i = 0; i < 26; i++)
		letterData.push(new Letter(letters[i], [0, 1, 2, 3, 4]));

	draw();
}
function draw() {
	var list = document.getElementsByClassName("tableRow");
	for (let i = list.length - 1; i >= 0; i--) {
		if (list[i] && list[i].parentElement)
			list[i].parentElement.removeChild(list[i]);
	}

	for (let i = 0; i < 6; i++) {
		const row = document.createElement("tr");
		row.className = "tableRow";
		for (let j = 0; j < 5; j++) {
			const cell = document.createElement("button");
			cell.setAttribute("style", `width: ${size}px; height: ${size}px; background-color: ${none}; font-size: ${size/3}px;`);
			cell.textContent = board[i][j].letter;
			switch (board[i][j].color) {
				case 0:
					cell.style.backgroundColor = none;
					break;
				case 1:
					cell.style.backgroundColor = green;
					break;
				case 2:
					cell.style.backgroundColor = yellow;
					break;
			}
			cell.onclick = () => onCellClick(i, j);
			row.append(cell);
		}
		table.append(row);
	}

	buttonContainer.setAttribute("style", `width: ${table.offsetWidth / 2}px; height: ${table.offsetHeight}px; top: 100px;`);

	// parentDiv.style.width =  `${table.offsetWidth * 2}px`;
	// parentDiv.style.height = `${table.offsetHeight}px`;

	noneButton.onclick = () => selectorColor = 0;
	greenButton.onclick = () => selectorColor = 1;
	yellowButton.onclick = () => selectorColor = 2;
	tempButton.onclick = () => {
		setText("HELLO");
	};
}

function onCellClick(x, y) {
	if (x != currentRow)
		return;	
	changeColor(x, y);
}
function changeColor(x, y) {
	board[x][y].color = selectorColor;
	draw();
}

function setText(text) {
	for (let i = 0; i < 5; i++)
		board[currentRow][i].letter = text.charAt(i);
	draw();
}

class Cell {
	constructor(letter, color) {
		this.letter = letter;
		this.color = color;
	}
}
class Letter {
	constructor(letter, location) {
		this.letter = letter;
		this.location = location;
	}
}