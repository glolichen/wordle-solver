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

function processData() {
	if (gameOver)
		return;

	for (let i = 0; i < 5; i++) {
		for (let j = 0; j < 5; j++) {
			if (board[currentRow][i].letter == board[currentRow][j].letter) {
				if (board[currentRow][i].color == 1 && board[currentRow][j].color == 0)
					board[currentRow][j].color = 2;
				else if (board[currentRow][i].color == 0 && board[currentRow][j].color == 1)
					board[currentRow][i].color = 2;
			}
		}
	}

	console.log(board[currentRow]);

	let correct = true;
	for (let i = 0; i < 5; i++) {
		let current = board[currentRow][i];
		let letterLocation = letters.indexOf(current.letter);
		searchedLetters.push(current.letter);
		switch (current.color) {
			case 0:
				correct = false;
				letterData[letterLocation][1].possibleLocation = [];
				break;
			case 1:
				confirmedLocations[i] = current.letter;
				letterData[letterLocation][1].confirmedLocation.push(i);
				mustContain.push(current.letter);
				break;
			case 2:
				correct = false;
				letterData[letterLocation][1].possibleLocation.splice(i, 1);
				mustContain.push(current.letter);
				break;
		}
	}

	if (correct) {
		alert("Yay!");
		gameOver = true;
		return;
	}

	currentRow++;
	selectorColor = 0;

	if (currentRow <= 1)
		setText(getLetterSearchWord());
	else {
		let solve = getSolve();
		console.log(solve);
		if (solve == undefined)
			setText(getLetterSearchWord());
		else
			setText(solve);
	}
}

function getLetterSearchWord() {
	let bestCount = 0;
	let bestWord = "";

	for (let i = 0; i < allWords.length; i++) {
		let word = allWords[i];
		let alreadyCounted = [];
		let count = 0;
		for (let j = 0; j < word.length; j++) {
			if (alreadyCounted.indexOf(word[j]) != -1 || searchedLetters.indexOf(word[j]) != -1)
				continue;
			if (letterData[letters.indexOf(word[j])][1].possibleLocation.length == 0)
			continue;
			alreadyCounted.push(word[j]);
			count += index[letters.indexOf(word[j])][1];
		}
		if (count > bestCount) {
			bestCount = count;
			bestWord = word;
		}
	}

	return bestWord;
}
function getSolve() {
	let validWords = [];
	for (let i = 0; i < words.length; i++) {
		let word = words[i];
		let valid = true;
		for (let j = 0; j < word.length; j++) {
			let letter = word[j];
			let letterLocation = letters.indexOf(letter);
			if (letterData[letterLocation][1].possibleLocation.indexOf(j) == -1)
				valid = false;
			if (confirmedLocations[j] != "" && confirmedLocations[j] != letter)
				valid = false;
			for (let k = 0; k < mustContain.length; k++) {
				if (word.indexOf(mustContain[k]) == -1) {
					valid = false;
					break;
				}
			}
			if (!valid)
				break;
		}
		if (valid)
			validWords.push(word);
	}

	words = validWords;

	if (validWords.length <= 3)
		return validWords[0];
	return undefined;
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