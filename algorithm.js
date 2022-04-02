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
	if (currentRow == 5) {
		alert("The computer lost :(");
		gameOver = true;
		return;
	}

	currentRow++;
	selectorColor = 0;

	if (currentRow <= 1)
		setText(getLetterSearchWord());
	else {
		let solve = getSolve();
		if (solve == undefined)
			setText(getLetterSearchWord());
		else
			setText(solve);
	}

	console.log(words);
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