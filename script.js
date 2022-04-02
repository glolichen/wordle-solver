var selectorColor = 0; // 0 = none, 1 = green, 2 = yellow

const table = document.getElementById("table");

const none = "#e9e9ed";
const green = "#99cc00";
const yellow = "#dddd00";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const fullWidth = document.body.clientWidth;

var size = 0;

var board = []; // stores the state of the game
var currentRow = 0; // the current row which the computer is processing

var words = []; // all the words that are still valid
var index = []; // how common every letter is

var searchedLetters = [];
var letterData = []; // where each letter can be
var confirmedLocations = [];
var mustContain = [];

var gameOver = false;

function init() {
	document.getElementById("grandparentDiv").style.height = `${document.body.clientHeight * 0.9}px`;
	size = fullWidth / 17;
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
    for (let i = 0; i < allWords.length; i++) {
        let word = allWords[i];
        for (let j = 0; j < word.length; j++)
			index[letters.indexOf(word.charAt(j))][1]++;
    }
	for (let i = 0; i < 5; i++)
		confirmedLocations.push("");

	for (let i = 0; i < 26; i++)
		letterData.push([letters.charAt(i), new Letter([], [0, 1, 2, 3, 4])]);

	let elements = document.getElementsByClassName("colorButton");
	for (let i = 0; i < elements.length; i++) {
		elements[i].style.width = `${fullWidth / 10}px`;
		elements[i].style.height = `${fullWidth / 20}px`;
	}

	setText(getLetterSearchWord());

	draw();

	document.getElementById("childInstructionContainer").style.width = `${table.offsetWidth / 1.5 + table.offsetWidth}px`; // TODO
	document.getElementById("parentButtonContainer").setAttribute("style", `width: ${table.offsetWidth / 1.5}px; height: ${table.offsetHeight}px; top: 100px;`);

	document.getElementById("noneButton").onclick = () => selectorColor = 0;
	document.getElementById("greenButton").onclick = () => selectorColor = 1;
	document.getElementById("yellowButton").onclick = () => selectorColor = 2;
	document.getElementById("makingComplete").onclick = () => processData();
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
}

function onCellClick(x, y) {
	if (x != currentRow || gameOver)
		return;	
	board[x][y].color = selectorColor;
	draw();
}

function setText(text) {
	console.log(text);
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
	constructor(confirmedLocation, possibleLocation) {
		this.confirmedLocation = confirmedLocation;
		this.possibleLocation = possibleLocation;
	}
}