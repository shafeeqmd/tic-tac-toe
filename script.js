const homePage = document.querySelector('.home-page');
const gameContainer = document.querySelector('.game-container');
const markerButtons = document.querySelectorAll('.marker-button');
const difficultyButtons = document.querySelectorAll('.difficulty-button');
const gameBoard = document.querySelector('.game-board');
const restartButton = document.getElementById('restartButton');
const goBackButton = document.getElementById('goBackButton');
const gameModeElement = document.getElementById('gameMode');
const currentPlayerElement = document.getElementById('currentPlayer');

let currentPlayer = 'X';
let gameState = [];
let gameActive = true;
let gridSize = 3; // default grid size for easy
let winningConditions = [];

const createWinningConditions = (size) => {
    const conditions = [];
    // Rows
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push(i * size + j);
        }
        conditions.push(row);
    }
    // Columns
    for (let i = 0; i < size; i++) {
        const col = [];
        for (let j = 0; j < size; j++) {
            col.push(i + j * size);
        }
        conditions.push(col);
    }
    // Diagonals
    const diag1 = [];
    const diag2 = [];
    for (let i = 0; i < size; i++) {
        diag1.push(i * size + i);
        diag2.push(i * size + (size - 1 - i));
    }
    conditions.push(diag1, diag2);
    return conditions;
};

const handleCellClick = (event) => {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add('clicked');

    if (checkWin()) {
        alert(`Player ${currentPlayer} wins!`);
        gameActive = false;
    } else if (gameState.every(cell => cell !== '')) {
        alert('Draw!');
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        currentPlayerElement.textContent = `Player: ${currentPlayer}'s turn`;
    }
};

const checkWin = () => {
    return winningConditions.some(condition => {
        return condition.every(index => {
            return gameState[index] === currentPlayer;
        });
    });
};

const restartGame = () => {
    gameState = Array(gridSize * gridSize).fill('');
    gameActive = true;
    gameBoard.innerHTML = '';
    createBoard(gridSize);
};

const handleMarkerChoice = (event) => {
    currentPlayer = event.target.getAttribute('data-marker');
    document.querySelector('.choose-marker').style.display = 'none';
    document.querySelector('.choose-difficulty').style.display = 'block';
};

const handleDifficultyChoice = (event) => {
    const difficulty = event.target.getAttribute('data-difficulty');
    let mode;
    if (difficulty === 'easy') {
        gridSize = 3;
        mode = 'Easy';
    } else if (difficulty === 'medium') {
        gridSize = 4;
        mode = 'Medium';
    } else if (difficulty === 'hard') {
        gridSize = 5;
        mode = 'Hard';
    }
    gameModeElement.textContent = `Mode: ${mode}`;
    winningConditions = createWinningConditions(gridSize);
    restartGame();
    homePage.style.opacity = 0;
    homePage.style.transform = 'scale(0.9)';

    // Set the first player's turn
    currentPlayer = markerButtons[0].getAttribute('data-marker');
    currentPlayerElement.textContent = `Player: ${currentPlayer}'s turn`;

    setTimeout(() => {
        homePage.style.display = 'none';
        gameContainer.style.display = 'block';
        gameContainer.style.opacity = 1;
        gameContainer.style.transform = 'scale(1)';
    }, 500);
};

const handleGoBack = () => {
    gameContainer.style.opacity = 0;
    gameContainer.style.transform = 'scale(0.9)';

    setTimeout(() => {
        gameContainer.style.display = 'none';
        homePage.style.display = 'block';
        homePage.style.opacity = 1;
        homePage.style.transform = 'scale(1)';
        document.querySelector('.choose-marker').style.display = 'block';
        document.querySelector('.choose-difficulty').style.display = 'none';
        restartGame();
    }, 500);
};

const createBoard = (size) => {
    gameBoard.style.gridTemplateColumns = `repeat(${size}, 100px)`;
    gameBoard.style.gridTemplateRows = `repeat(${size}, 100px)`;
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cell);

        // Adding delay to create fade-in effect
        setTimeout(() => {
            cell.classList.add('visible');
        }, 50 * i);
    }
};

markerButtons.forEach(button => button.addEventListener('click', handleMarkerChoice));
difficultyButtons.forEach(button => button.addEventListener('click', handleDifficultyChoice));
restartButton.addEventListener('click', restartGame);
goBackButton.addEventListener('click', handleGoBack);
